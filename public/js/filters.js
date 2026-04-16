'use strict';
import { State } from './state.js';
import { produtos } from './data.js';
import { renderizarProdutos } from './render.js';
import { Cart } from './cart.js';

const CATEGORIAS_MAP = {
    'Cervejas': ['Cervejas Avulsas', 'Fardos'],
    'Refrigerantes': ['Refrigerantes Lata', 'Refrigerantes 2L'],
    'Tabacaria': ['Essências', 'Combos Essências', 'Carvão', 'Cigarros'],
    'Mercearia': ['Salgadinhos', 'Doces']
};

export function aplicarFiltros() {
    let lista = [...produtos];
    if (State.categoriaAtiva && State.categoriaAtiva !== 'Todos') {
        const sub = CATEGORIAS_MAP[State.categoriaAtiva];
        lista = sub ? lista.filter(p => sub.includes(p.categoria)) : lista.filter(p => p.categoria === State.categoriaAtiva);
    }
    if (State.termoBusca) {
        const t = State.termoBusca.toLowerCase();
        lista = lista.filter(p => p.nome.toLowerCase().includes(t) || p.codigo.toLowerCase().includes(t) || p.categoria.toLowerCase().includes(t));
    }
    if (State.ordenacaoAtual) {
        const sorters = {
            'name-asc': (a,b)=>a.nome.localeCompare(b.nome), 'name-desc': (a,b)=>b.nome.localeCompare(a.nome),
            'price-asc': (a,b)=>a.preco-b.preco, 'price-desc': (a,b)=>b.preco-a.preco
        };
        lista.sort(sorters[State.ordenacaoAtual] || sorters['name-asc']);
    }
    renderizarProdutos(lista, Cart.cart);
    atualizarContadores();
}

export function atualizarContadores() {
    // Atualiza contadores no menu lateral
    document.querySelectorAll('[data-categoria]').forEach(btn => {
        const cat = btn.dataset.categoria;
        const count = cat === 'Todos' ? produtos.length : produtos.filter(p => p.categoria === cat).length;
        let span = btn.querySelector('.count');
        if (!span) { span = document.createElement('span'); span.className = 'count'; btn.appendChild(span); }
        span.textContent = `(${count})`;
    });
}