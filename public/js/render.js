'use strict';

import { State, formatarPreco, gerarChave } from './state.js';
import { Cart } from './cart.js';

/**
 * Renderiza a grade de produtos na vitrine
 * @param {Array} lista - Lista de produtos vindos do Firestore
 * @param {Object} cartState - Estado atual do carrinho
 */
export function renderizarProdutos(lista = [], cartState = {}) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return console.warn('⚠️ #productsGrid não encontrado no HTML');

    if (!Array.isArray(lista)) {
        console.error('❌ lista inválida:', lista);
        return;
    }

    // Salva a lista globalmente para que outros módulos (como o Cart) possam consultá-la
    window.__produtosAtuais = lista;
    window.renderizarProdutos = renderizarProdutos;

    const frag = document.createDocumentFragment();

    lista.forEach(p => {
        const card = document.createElement('div');
        card.className = `product-card ${State.viewMode === 'list' ? 'view-list' : ''}`;
        card.dataset.id = p.id;

        // Pega o sabor inicial para mostrar a quantidade correta no carregamento
        const saborInicial = p.sabores?.length > 0 ? p.sabores[0] : '';
        const chave = gerarChave(p.id, saborInicial);
        const qty = cartState[chave]?.quantidade || 0;

        const precoSeguro = Number(p.preco || 0);

        card.innerHTML = `
            <div class="product-image">
                <img src="${p.imagem || 'assets/images/em-breve.webp'}" 
                     alt="${p.nome || 'Produto'}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='assets/images/em-breve.webp'">
            </div>

            <div class="product-info">
                <div class="product-code">${p.codigo || ''}</div>
                <div class="product-name">${p.nome || 'Sem nome'}</div>
                <div class="product-price">${formatarPreco(precoSeguro)}</div>

                ${p.sabores?.length > 0 ? `
                <div class="sabor-container">
                    <label class="sabor-label" for="sabor-${p.id}">Sabor:</label>
                    <select class="select-sabor" id="sabor-${p.id}" data-id="${p.id}">
                        ${p.sabores.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>` : ''}

                <div class="qty-controls">
                    <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
                    <span class="product-qty" id="qty-${p.id}">${qty}</span>
                    <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
                </div>
            </div>
        `;

        frag.appendChild(card);
    });

    grid.innerHTML = '';
    grid.appendChild(frag);

    // 🔥 CONFIGURAÇÃO DOS EVENTOS (DELEGAÇÃO)
    // Removemos eventos antigos para não duplicar
    grid.replaceWith(grid.cloneNode(true));
    const newGrid = document.getElementById('productsGrid');

    newGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.qty-btn');
        if (!btn) return;

        e.preventDefault();

        const id = btn.dataset.id;
        const action = btn.dataset.action;

        // Busca o produto na lista atual
        const produto = lista.find(p => String(p.id) === String(id));
        if (!produto) return;

        // Pega o sabor selecionado no momento do clique
        const card = btn.closest('.product-card');
        const select = card?.querySelector('.select-sabor');
        const sabor = select?.value || '';

        const chave = gerarChave(produto.id, sabor);

        if (action === 'inc') {
            Cart.add(produto, sabor);
        } else if (action === 'dec') {
            Cart.updateQuantity(chave, -1);
        }
    });

    // Evento para atualizar o número da quantidade ao trocar o sabor no select
    newGrid.addEventListener('change', (e) => {
        if (e.target.classList.contains('select-sabor')) {
            const select = e.target;
            const id = select.dataset.id;
            const sabor = select.value;
            const chave = gerarChave(id, sabor);
            
            const qtyDisplay = document.getElementById(`qty-${id}`);
            if (qtyDisplay) {
                const qty = Cart.cart[chave]?.quantidade || 0;
                qtyDisplay.textContent = qty;
            }
        }
    });
}