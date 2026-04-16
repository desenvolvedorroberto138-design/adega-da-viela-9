'use strict';

/**
 * INTERFACE DO USUÁRIO
 */

import { State, $, $$, el, Config, formatarPreco, gerarChave } from './state.js';
import { Cart } from './cart.js';
import { renderizarProdutos } from './render.js';
import { aplicarFiltros } from './filters.js';
import { 
    abrirModal, fecharModal, enviarWhatsApp, 
    verificarPedidoMinimo, atualizarResumo, buscarCep 
} from './checkout.js';

// Fecha carrinho drawer
export function fecharCarrinho() { 
    if (document.activeElement) document.activeElement.blur();

    el.cartDrawer?.classList.remove('open'); 
    el.overlay?.classList.remove('active'); 
    el.cartDrawer?.setAttribute('aria-hidden','true'); 

    el.cartBtn?.focus();
}

// Sidebar
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

// EVENTOS
export function setupEventListeners() {

    // CLICK GLOBAL
    document.addEventListener('click', (e) => {

        // Dropdown
        const toggle = e.target.closest('.dropdown-toggle');
        if (toggle) {
            e.preventDefault();
            const dd = toggle.closest('.dropdown');
            $$('.dropdown').forEach(d => d !== dd && d.classList.remove('active'));
            dd?.classList.toggle('active');
            return;
        }

        // Categoria
        const cat = e.target.closest('[data-categoria]');
        if (cat) {
            e.preventDefault();
            State.categoriaAtiva = cat.dataset.categoria;
            $$('[data-categoria]').forEach(b => b.closest('li')?.classList.remove('active'));
            cat.closest('li')?.classList.add('active');
            aplicarFiltros();
            return;
        }

        // BOTÕES + / -
        const qtyBtn = e.target.closest('.qty-btn');
        if (qtyBtn) {
            e.preventDefault();

            Cart.handleQuantityChange(qtyBtn);

            // 🔥 ATUALIZA UI DOS PRODUTOS
            aplicarFiltros();

            return;
        }

        // Fecha dropdown
        if (!e.target.closest('.sidebar')) {
            $$('.dropdown').forEach(d => d.classList.remove('active'));
        }
    });

    // 🔥 TROCA DE SABOR (AQUI ESTÁ A MELHORIA)
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('select-sabor')) {
            const select = e.target;
            const card = select.closest('.product-card');
            const id = parseInt(card.dataset.id);
            const sabor = select.value;

            const chave = gerarChave(id, sabor);
            const item = Cart.cart[chave];

            const qtyEl = card.querySelector('.product-qty');
            if (qtyEl) {
                qtyEl.textContent = item ? item.quantidade : 0;
            }
        }
    });

    // CEP
    el.btnBuscaCep?.addEventListener('click', buscarCep);
    el.clienteCep?.addEventListener('blur', buscarCep);

    // Carrinho
    el.cartBtn?.addEventListener('click', () => { 
        el.cartDrawer?.classList.add('open'); 
        el.overlay?.classList.add('active'); 
        Cart.updateDisplay(); 
    });

    el.closeCart?.addEventListener('click', fecharCarrinho);
    el.overlay?.addEventListener('click', fecharCarrinho);

    el.clearCart?.addEventListener('click', () => { 
        if (confirm('Limpar sacola?')) { 
            Cart.clear(); 
            aplicarFiltros();
        } 
    });

    // Modal
    el.checkoutBtn?.addEventListener('click', abrirModal);
    el.closeModal?.addEventListener('click', fecharModal);

    el.modal?.addEventListener('click', (e) => { 
        if (e.target === el.modal) fecharModal(); 
    });

    el.enviarWhatsapp?.addEventListener('click', enviarWhatsApp);

    // Pagamento
    el.formaPagamento?.addEventListener('change', function() {
        el.trocoContainer?.classList.toggle('hidden', this.value !== 'Dinheiro');
    });

    // Troco
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

    // Inputs
    el.clienteRua?.addEventListener('input', atualizarResumo);
    el.clienteNumero?.addEventListener('input', atualizarResumo);
    el.radioEnvio?.forEach(r => r.addEventListener('change', verificarPedidoMinimo));

    el.searchInput?.addEventListener('input', (e) => { 
        State.termoBusca = e.target.value.toLowerCase();
        aplicarFiltros(); 
    });

    el.sortSelect?.addEventListener('change', (e) => { 
        State.ordenacaoAtual = e.target.value;
        aplicarFiltros(); 
    });

    el.viewToggle?.addEventListener('click', () => { 
        State.viewMode = State.viewMode === 'grid' ? 'list' : 'grid';
        aplicarFiltros(); 
    });

    // ESC
    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') { 
            fecharCarrinho(); 
            fecharModal(); 
            closeSidebar();
        } 
    });

    // Menu mobile
    el.hamburgerBtn?.addEventListener('click', () => {
        el.sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    el.sidebarOverlay?.addEventListener('click', closeSidebar);
}