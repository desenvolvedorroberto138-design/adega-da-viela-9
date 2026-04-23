'use strict';

import { State, safeGet, safeSet, formatarPreco, gerarChave } from './state.js';

export const Cart = {
    cart: safeGet('cart_a9v', {}),

    init() {
        this.updateDisplay();
    },

    add(produto, sabor = '') {
        if (!produto) return;

        const chave = gerarChave(produto.id, sabor);

        if (this.cart[chave]) {
            this.cart[chave].quantidade++;
        } else {
            this.cart[chave] = {
                id: produto.id,
                nome: produto.name || produto.nome || 'Sem nome',
                preco: Number(produto.price ?? produto.preco ?? 0),
                imagem: produto.image || produto.imagem || 'assets/images/em-breve.webp',
                codigo: produto.codigo || '',
                sabor: sabor || null,
                quantidade: 1
            };
        }

        this.save();
        this.updateDisplay();
    },

    updateQuantity(chave, delta) {
        if (!this.cart[chave]) return;

        this.cart[chave].quantidade += delta;

        if (this.cart[chave].quantidade <= 0) {
            delete this.cart[chave];
        }

        this.save();
        this.updateDisplay();
    },

    clear() {
        this.cart = {};
        this.save();
        this.updateDisplay();
    },

    save() {
        safeSet('cart_a9v', this.cart);
    },

    getTotals() {
        let total = 0;
        let itens = 0;

        Object.values(this.cart).forEach(i => {
            total += (Number(i.preco) || 0) * i.quantidade;
            itens += i.quantidade;
        });

        return { total, itens };
    },

    updateDisplay() {
        const { total, itens } = this.getTotals();
        State.totalGlobal = total;

        // Atualiza badges (bolinhas de contagem)
        document.querySelectorAll('#cartCount, #cartItemsCount')
            .forEach(b => b && (b.textContent = itens));

        // Atualiza totais financeiros
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) cartTotal.textContent = formatarPreco(total);

        const footerTotal = document.getElementById('footerTotal');
        if (footerTotal) footerTotal.textContent = formatarPreco(total);

        this.renderDrawerItems();

        // 🔥 Sincroniza a vitrine de produtos
        // Importante: Como agora usamos módulos, verificamos se a função de renderizar 
        // está disponível para atualizar os botões de +/- nos cards da vitrine
        if (window.renderizarProdutos) {
            window.renderizarProdutos(window.__produtosAtuais || [], this.cart);
        }
    },

    renderDrawerItems() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        const items = Object.values(this.cart);

        if (items.length === 0) {
            container.innerHTML = '<p class="empty-cart text-center py-8 text-gray-500">Sua sacola está vazia 🛒</p>';
            return;
        }

        container.innerHTML = items.map(item => {
            const chave = gerarChave(item.id, item.sabor || '');

            return `
                <div class="cart-item flex items-center gap-4 p-4 border-b border-gray-100">
                    <div class="cart-item-image w-16 h-16 flex-shrink-0">
                        <img src="${item.imagem}" 
                             alt="${item.nome}" 
                             class="w-full h-full object-contain"
                             onerror="this.src='assets/images/em-breve.webp'">
                    </div>

                    <div class="cart-item-info flex-1">
                        <h4 class="text-sm font-bold text-gray-800">
                            ${item.nome}
                            ${item.sabor ? `<br><small class="text-red-800 font-normal italic">${item.sabor}</small>` : ''}
                        </h4>
                        <span class="text-[10px] text-gray-400 block uppercase">${item.codigo}</span>
                        <span class="text-red-900 font-bold">
                            ${formatarPreco(item.preco * item.quantidade)}
                        </span>
                    </div>

                    <div class="cart-item-qty flex items-center bg-gray-100 rounded-lg">
                        <button class="qty-btn px-2 py-1 text-red-800 font-bold" data-action="dec" data-chave="${chave}">−</button>
                        <span class="w-8 text-center text-sm font-bold">${item.quantidade}</span>
                        <button class="qty-btn px-2 py-1 text-red-800 font-bold" data-action="inc" data-chave="${chave}">+</button>
                    </div>
                </div>
            `;
        }).join('');

        // Listener para os botões de quantidade dentro do carrinho
        // Removemos o {once: true} para permitir cliques sucessivos
        const newContainer = container.cloneNode(true);
        container.parentNode.replaceChild(newContainer, container);
        
        newContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.qty-btn');
            if (!btn) return;

            const chave = btn.dataset.chave;
            const action = btn.dataset.action;

            this.updateQuantity(chave, action === 'inc' ? 1 : -1);
        });
    }
};