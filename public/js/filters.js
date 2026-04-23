'use strict';

import { State } from './state.js';
import { renderizarProdutos } from './render.js';
import { Cart } from './cart.js';

const CATEGORIAS_MAP = {
    'Cervejas': ['Cervejas Avulsas', 'Fardos'],
    'Refrigerantes': ['Refrigerantes Lata', 'Refrigerantes 2L'],
    'Tabacaria': ['Essências', 'Combos Essências', 'Carvão', 'Cigarros'],
    'Mercearia': ['Salgadinhos', 'Doces']
};

export function aplicarFiltros(produtosFirestore = []) {
    // Iniciamos sempre com a cópia da lista completa
    let lista = [...produtosFirestore];

    // 1. 🔍 BUSCA (Prioridade Máxima)
    // Se o usuário digitou algo, procuramos em todos os produtos primeiro
    if (State.termoBusca) {
        const t = State.termoBusca.toLowerCase();

        lista = lista.filter(p => {
            const nome = (p.nome || '').toLowerCase();
            const codigo = (p.codigo || '').toLowerCase();
            const categoria = (p.categoria || '').toLowerCase();
            
            // Procura também dentro do Array de sabores
            const sabores = Array.isArray(p.sabores) 
                ? p.sabores.join(' ').toLowerCase() 
                : (p.sabores || '').toLowerCase();

            return nome.includes(t) || 
                   codigo.includes(t) || 
                   categoria.includes(t) || 
                   sabores.includes(t);
        });
    }

    // 2. 🧠 FILTRO POR CATEGORIA 
    // Só aplicamos o filtro de categoria se a busca estiver vazia 
    // OU se você quiser filtrar a busca dentro da categoria (opcional)
    if (State.categoriaAtiva && State.categoriaAtiva !== 'Todos' && !State.termoBusca) {
        const sub = CATEGORIAS_MAP[State.categoriaAtiva];

        lista = sub
            ? lista.filter(p => sub.includes(p.categoria))
            : lista.filter(p => p.categoria === State.categoriaAtiva);
    }

    // 3. 🔄 ORDENAÇÃO
    if (State.ordenacaoAtual) {
        const sorters = {
            'name-asc': (a,b) => (a.nome || '').localeCompare(b.nome || ''),
            'name-desc': (a,b) => (b.nome || '').localeCompare(a.nome || ''),
            'price-asc': (a,b) => a.preco - b.preco,
            'price-desc': (a,b) => b.preco - a.preco
        };

        lista.sort(sorters[State.ordenacaoAtual] || sorters['name-asc']);
    }

    // 🎯 RENDER FINAL
    renderizarProdutos(lista, Cart.cart);

    // 🔢 CONTADORES (Sempre baseados na lista bruta do Firestore)
    atualizarContadores(produtosFirestore);
}

export function atualizarContadores(produtosFirestore = []) {
    document.querySelectorAll('[data-categoria]').forEach(btn => {
        const cat = btn.dataset.categoria;
        let count = 0;

        if (cat === 'Todos') {
            count = produtosFirestore.length;
        } else if (CATEGORIAS_MAP[cat]) {
            const sub = CATEGORIAS_MAP[cat];
            count = produtosFirestore.filter(p => sub.includes(p.categoria)).length;
        } else {
            count = produtosFirestore.filter(p => p.categoria === cat).length;
        }

        // Procura o span com a classe count dentro do elemento
        let span = btn.querySelector('.count');
        
        if (span) {
            span.textContent = `(${count})`;
        }
    });
}