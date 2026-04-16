'use strict';
import { State, formatarPreco, gerarChave } from './state.js';
import { produtos } from './data.js';

export function renderizarProdutos(lista = produtos, cartState = {}) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return console.warn('⚠️ #productsGrid não encontrado no HTML');

    if (!Array.isArray(lista)) {
        console.error('❌ lista inválida:', lista);
        return;
    }

    const frag = document.createDocumentFragment();

    lista.forEach(p => {
        const card = document.createElement('div');
        card.className = `product-card ${State.viewMode === 'list' ? 'view-list' : ''}`;
        card.dataset.id = p.id;
        
       const saborSelecionado = p.sabores?.[0] || '';
       const chave = gerarChave(p.id, saborSelecionado);
       const qty = cartState[chave]?.quantidade || 0;

        card.innerHTML = `
            <div class="product-image">
                <img src="${p.imagem}" 
                     alt="${p.nome}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='image/cachaca/em-breve.webp'">
            </div>
            <div class="product-info">
                <div class="product-code">${p.codigo}</div>
                <div class="product-name">${p.nome}</div>
                <div class="product-price">${formatarPreco(p.preco)}</div>
                ${p.sabores?.length > 0 ? `
                <div class="sabor-container">
                    <label class="sabor-label" for="sabor-${p.id}">Sabor:</label>
                    <select class="select-sabor" id="sabor-${p.id}">
                        ${p.sabores.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>` : ''}
                <div class="qty-controls">
                    <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
                    <span class="product-qty">${qty}</span>
                    <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
                </div>
            </div>`;
        
        frag.appendChild(card);
    });

    grid.innerHTML = '';
    grid.appendChild(frag);
}