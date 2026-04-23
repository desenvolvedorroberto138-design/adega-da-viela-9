'use strict';

/**
 * INTERFACE DO USUÁRIO - ADEGA VIELA 9
 */

import { State, $, $$, el, Config, formatarPreco, gerarChave } from './state.js';
import { Cart } from './cart.js';
import { aplicarFiltros } from './filters.js';
import { 
    abrirModal, fecharModal, enviarWhatsApp, 
    verificarPedidoMinimo, atualizarResumo, buscarCep 
} from './checkout.js';


// ==========================
// 🔥 CARRINHO (FECHAR)
// ==========================
export function fecharCarrinho() { 
    const drawer = el.cartDrawer;
    document.activeElement?.blur();
    drawer?.classList.remove('open'); 
    el.overlay?.classList.remove('active'); 
    drawer?.setAttribute('aria-hidden', 'true'); 
    el.cartBtn?.focus();
}


// ==========================
// SIDEBAR (MENU MOBILE)
// ==========================
export function openSidebar() {
    el.sidebar?.classList.add('open');
    el.hamburgerBtn?.classList.add('active');
    el.sidebarOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

export function closeSidebar() {
    el.sidebar?.classList.remove('open');
    el.hamburgerBtn?.classList.remove('active');
    el.sidebarOverlay?.classList.remove('active');
    document.body.style.overflow = '';
}


// ==========================
// EVENTOS GERAIS
// ==========================
export function setupEventListeners() {

    // CLICK GLOBAL
    document.addEventListener('click', (e) => {

        // Dropdown do Menu
        const toggle = e.target.closest('.dropdown-toggle');
        if (toggle) {
            e.preventDefault();
            const dd = toggle.closest('.dropdown');
            $$('.dropdown').forEach(d => d !== dd && d.classList.remove('active'));
            dd?.classList.toggle('active');
            return;
        }

        // Seleção de Categoria (Vinhos, Cervejas, etc)
        const cat = e.target.closest('[data-categoria]');
        if (cat) {
            e.preventDefault();
            State.categoriaAtiva = cat.dataset.categoria;
            
            // UI Update: destaca a categoria ativa
            $$('[data-categoria]').forEach(b => b.closest('li')?.classList.remove('active'));
            cat.closest('li')?.classList.add('active');
            
            // 🔥 Importante: Passa a lista global do Firebase para o filtro
            aplicarFiltros(window.__produtosAtuais);
            
            // Fecha o menu mobile ao clicar (opcional)
            if (window.innerWidth < 1024) closeSidebar();
            return;
        }

        // Fecha dropdown se clicar fora
        if (!e.target.closest('.sidebar')) {
            $$('.dropdown').forEach(d => d.classList.remove('active'));
        }
    });


    // ==========================
    // TROCA DE SABOR / VARIAÇÃO NO CARD
    // ==========================
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('select-sabor')) {
            const select = e.target;
            const card = select.closest('.product-card');
            const id = card.dataset.id; // Firestore usa String, não Int
            const sabor = select.value;

            const chave = gerarChave(id, sabor);
            const item = Cart.cart[chave];

            const qtyEl = card.querySelector('.product-qty');
            if (qtyEl) {
                qtyEl.textContent = item ? item.quantidade : 0;
            }
        }
    });


    // ==========================
    // BUSCA DE CEP
    // ==========================
    el.btnBuscaCep?.addEventListener('click', buscarCep);
    el.clienteCep?.addEventListener('blur', buscarCep);


    // ==========================
    // CARRINHO ABRIR / FECHAR
    // ==========================
    el.cartBtn?.addEventListener('click', () => { 
        el.cartDrawer?.classList.add('open'); 
        el.overlay?.classList.add('active'); 
        el.cartDrawer?.removeAttribute('aria-hidden'); 
        Cart.updateDisplay(); 
    });

    el.closeCart?.addEventListener('click', fecharCarrinho);
    el.overlay?.addEventListener('click', fecharCarrinho);


    // ==========================
    // LIMPAR CARRINHO
    // ==========================
    el.clearCart?.addEventListener('click', () => { 
        if (confirm('Limpar sua sacola de compras?')) { 
            Cart.clear(); 
            aplicarFiltros(window.__produtosAtuais);
        } 
    });


    // ==========================
    // MODAL DE CHECKOUT
    // ==========================
    el.checkoutBtn?.addEventListener('click', abrirModal);
    el.closeModal?.addEventListener('click', fecharModal);

    el.modal?.addEventListener('click', (e) => { 
        if (e.target === el.modal) fecharModal(); 
    });

    el.enviarWhatsapp?.addEventListener('click', enviarWhatsApp);


    // ==========================
    // LÓGICA DE PAGAMENTO
    // ==========================
    el.formaPagamento?.addEventListener('change', function() {
        el.trocoContainer?.classList.toggle('hidden', this.value !== 'Dinheiro');
    });


    // ==========================
    // CÁLCULO DE TROCO
    // ==========================
    el.inputTroco?.addEventListener('input', () => {
        if (!el.valorTroco) return;

        const val = parseFloat(el.inputTroco.value.replace(',','.'));
        const isRet = document.querySelector('input[name="opcaoEnvio"]:checked')?.value === 'retirada';
        const taxa = isRet ? 0 : Config.TAXA_ENTREGA_FIXA;
        const total = State.totalGlobal + taxa;

        if (isNaN(val)) return el.valorTroco.textContent = '';

        const troco = val - total;
        el.valorTroco.textContent = troco < 0 
            ? '❌ Valor insuficiente' 
            : `💰 Troco: ${formatarPreco(troco)}`;
    });


    // ==========================
    // FILTROS DE BUSCA E ORDENAÇÃO
    // ==========================
    el.clienteRua?.addEventListener('input', atualizarResumo);
    el.clienteNumero?.addEventListener('input', atualizarResumo);
    el.radioEnvio?.forEach(r => r.addEventListener('change', verificarPedidoMinimo));

    el.searchInput?.addEventListener('input', (e) => { 
        State.termoBusca = e.target.value.toLowerCase();
        aplicarFiltros(window.__produtosAtuais); 
    });

    el.sortSelect?.addEventListener('change', (e) => { 
        State.ordenacaoAtual = e.target.value;
        aplicarFiltros(window.__produtosAtuais); 
    });

    el.viewToggle?.addEventListener('click', () => { 
        State.viewMode = State.viewMode === 'grid' ? 'list' : 'grid';
        aplicarFiltros(window.__produtosAtuais); 
    });


    // ==========================
    // ATALHOS DE TECLADO
    // ==========================
    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') { 
            fecharCarrinho(); 
            fecharModal(); 
            closeSidebar();
        } 
    });


    // ==========================
    // MENU MOBILE (HAMBURGER)
    // ==========================
    el.hamburgerBtn?.addEventListener('click', () => {
        el.sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    el.sidebarOverlay?.addEventListener('click', closeSidebar);
}