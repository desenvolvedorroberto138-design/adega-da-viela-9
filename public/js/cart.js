'use strict';

import { State, safeGet, safeSet, formatarPreco, gerarChave } from './state.js';
import { produtos } from './data.js';
import { renderizarProdutos } from './render.js';

export const Cart = {
    cart: safeGet('cart_a9v', {}),

    init() {
        this.updateDisplay();
    },

    add(id, sabor = '') {
        const produto = produtos.find(p => p.id === id);
        if (!produto) return;

        const chave = gerarChave(id, sabor);

        if (this.cart[chave]) {
            this.cart[chave].quantidade++;
        } else {
            this.cart[chave] = {
                id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                codigo: produto.codigo,
                sabor: sabor || null,
                quantidade: 1
            };
        }

        this.save();
        this.updateDisplay();
    },

    remove(chave) {
        delete this.cart[chave];
        this.save();
        this.updateDisplay();
    },

    updateQuantity(chave, delta) {
        if (!this.cart[chave]) return;

        this.cart[chave].quantidade += delta;

        if (this.cart[chave].quantidade <= 0) {
            this.remove(chave);
        } else {
            this.save();
            this.updateDisplay();
        }
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
            total += i.preco * i.quantidade;
            itens += i.quantidade;
        });

        return { total, itens };
    },

    updateDisplay() {
        const { total, itens } = this.getTotals();
        State.totalGlobal = total;

        // Atualiza badges
        const badges = document.querySelectorAll('#cartCount, #cartItemsCount');
        badges.forEach(b => {
            if (b) b.textContent = itens;
        });

        // Totais
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) cartTotal.textContent = formatarPreco(total);

        const footerTotal = document.getElementById('footerTotal');
        if (footerTotal) footerTotal.textContent = formatarPreco(total);

        // Render drawer
        this.renderDrawerItems();

        // 🔥 Atualiza produtos (MOSTRAR QTD NOS CARDS)
        renderizarProdutos(produtos, this.cart);
    },

    renderDrawerItems() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        const items = Object.values(this.cart);

        if (items.length === 0) {
            container.innerHTML = '<p class="empty-cart">Sua sacola está vazia 🛒</p>';
            return;
        }

        container.innerHTML = items.map(item => {
            const chave = gerarChave(item.id, item.sabor || '');

            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='assets/images/cachaca/em-breve.webp'">
                    </div>

                    <div class="cart-item-info">
                        <h4>
                            ${item.nome}
                            ${item.sabor ? `<br><small>${item.sabor}</small>` : ''}
                        </h4>

                        <span class="cart-item-code">${item.codigo}</span>
                        <span class="cart-item-total">
                            ${formatarPreco(item.preco * item.quantidade)}
                        </span>
                    </div>

                    <div class="cart-item-qty">
                        <button class="qty-btn" data-action="dec" data-chave="${chave}">−</button>
                        <span>${item.quantidade}</span>
                        <button class="qty-btn" data-action="inc" data-chave="${chave}">+</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    handleQuantityChange(btn) {
        const action = btn.dataset.action;

        // 🔥 CASO 1: botão dentro do carrinho
        if (btn.dataset.chave) {
            const chave = btn.dataset.chave;
            this.updateQuantity(chave, action === 'inc' ? 1 : -1);
            return;
        }

        // 🔥 CASO 2: botão nos produtos
        const id = parseInt(btn.dataset.id);
        const card = btn.closest('.product-card');
        const select = card?.querySelector('.select-sabor');
        const sabor = select ? select.value : '';

        const chave = gerarChave(id, sabor);

        if (action === 'inc') {
            this.add(id, sabor);
        } else if (action === 'dec') {
            this.updateQuantity(chave, -1);
        }
    }
};