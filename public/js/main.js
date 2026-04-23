'use strict';

// 🔥 1. Configuração do Firebase
import { db, auth } from "./firebase.js"; 
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔧 2. Imports de Lógica do Projeto
import { el } from './state.js';
import { Cart } from './cart.js';
import { aplicarFiltros, atualizarContadores } from './filters.js';
import { verificarPedidoMinimo } from './checkout.js';
import { setupEventListeners } from './ui.js';
import { renderizarProdutos } from './render.js';

// ================================
// 📦 ESTADO GLOBAL DOS PRODUTOS
// ================================
// Mantemos esta lista intacta como nossa "Fonte da Verdade"
export let produtosGlobais = [];

// ================================
// 🛠️ NORMALIZADOR DE PRODUTO
// ================================
function normalizeProduct(doc) {
    const d = doc.data();
    return {
        id: doc.id,
        nome: d.nome || d.name || "Sem nome",
        preco: Number(d.preco ?? d.price ?? 0),
        imagem: d.imagem || d.image || 'assets/images/em-breve.webp',
        categoria: d.categoria || d.category || 'Outros',
        sabores: Array.isArray(d.sabores) ? d.sabores : [], // Garante que seja Array
        codigo: d.codigo || d.sku || ''
    };
}

// ================================
// 📡 BUSCAR PRODUTOS (TEMPO REAL)
// ================================
function buscarProdutos() {
    console.log("📡 Conectando ao Firestore (tempo real)...");

    const ref = collection(db, "products");

    onSnapshot(ref, (snapshot) => {
        // Limpamos e repopulamos a lista global
        produtosGlobais = snapshot.docs.map(doc => normalizeProduct(doc));

        console.log(`📦 ${produtosGlobais.length} produtos carregados.`);

        // 1. Atualiza os números (ex: Cerveja (10)) no menu lateral baseado na lista real
        atualizarContadores(produtosGlobais);

        // 2. Chama a lógica de filtros que decidirá o que mostrar no Grid
        // Isso impede que a busca "mate" o estado do site
        aplicarFiltros(produtosGlobais);

    }, (error) => {
        console.error("❌ Erro no listener do Firestore:", error);
    });
}

// ================================
// 🚀 INICIALIZAÇÃO DO SISTEMA (INIT)
// ================================
function init() {
    console.log('🚀 Iniciando Adega Viela 9...');

    // Mapeamento automático de elementos do DOM
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

    ids.forEach(id => {
        el[id] = document.getElementById(id);
    });

    el.modal = document.getElementById('checkoutModal');
    el.radioEnvio = document.querySelectorAll('input[name="opcaoEnvio"]');

    if (!el.productsGrid) {
        console.error('❌ Erro: Container #productsGrid não encontrado no HTML.');
        return;
    }

    console.log('✅ Elementos da interface mapeados');

    // Inicialização dos módulos
    Cart.init();
    verificarPedidoMinimo();
    setupEventListeners();

    // 🔥 Conecta ao Firestore em tempo real
    buscarProdutos();

    // Configura o evento de busca para reagir em tempo real sem zerar nada
    if (el.searchInput) {
        el.searchInput.addEventListener('input', () => {
            aplicarFiltros(produtosGlobais);
        });
    }

    console.log('🍷 Sistema pronto para o cliente!');
}

// ================================
// ⭐ DISPARO DO APP
// ================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}