'use strict';

import { el } from './state.js';
import { Cart } from './cart.js';
import { aplicarFiltros } from './filters.js';
import { verificarPedidoMinimo } from './checkout.js';
import { setupEventListeners } from './ui.js';

// importa só pra garantir execução
import './data.js';
import './render.js';

function init() {
    console.log('🚀 Iniciando Adega Viela 9...');
    
    // 1. Cache de elementos
    const ids = [
        'productsGrid', 'cartBtn', 'cartDrawer', 'overlay', 'closeCart',
        'cartCount', 'cartItemsCount', 'cartTotal', 'footerTotal', 'cartItems',
        'clearCart', 'checkoutBtn', 'searchInput', 'sortSelect', 'viewToggle',
        'checkoutModal', 'closeModal', 'checkoutForm', 'enviarWhatsapp',
        'clienteNome', 'clienteTelefone', 'clienteCep', 'clienteRua', 'clienteBairro',
        'clienteCidade', 'clienteNumero', 'clienteComplemento', 'clienteReferencia',
        'enderecoGroup', 'enderecoHelp', 'formaPagamento', 'trocoContainer', 'inputTroco',
        'valorTroco', 'resumoProdutos', 'resumoEntrega', 'resumoTotal', 'textoInformativo',
        'sidebar', 'hamburgerBtn', 'sidebarOverlay', 'btnBuscaCep', 'cepLoading',
        'cepError', 'cepSuccess', 'tipoEntrega'
    ];

    ids.forEach(id => { el[id] = document.getElementById(id); });
    el.modal = document.getElementById('checkoutModal');

    el.radioEnvio = document.querySelectorAll('input[name="opcaoEnvio"]');

    // 2. Verifica DOM
    if (!el.productsGrid) {
        console.error('❌ #productsGrid não encontrado!');
        return;
    }

    console.log('✅ DOM carregado');

    // 3. Inicializa sistema
    Cart.init();
    aplicarFiltros();
    verificarPedidoMinimo();
    setupEventListeners();

    console.log('🍷 Sistema pronto!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}