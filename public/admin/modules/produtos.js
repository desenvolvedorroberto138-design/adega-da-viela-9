'use strict';

import { db } from '../../js/firebase.js';
import { 
    collection, onSnapshot, query, orderBy, doc, 
    deleteDoc, updateDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let todosOsProdutos = [];
let unsubProdutos = null; 

// --- 1. ESCUTA E RENDERIZAÇÃO ---
export function escutarProdutos() {
    const adminProductList = document.getElementById('admin-product-list');
    if (!adminProductList) return;

    if (unsubProdutos) unsubProdutos();

    // AJUSTE 1: Mudado de "produtos" para "products"
    const q = query(collection(db, "products"), orderBy("dataCriacao", "desc"));
    
    unsubProdutos = onSnapshot(q, (snap) => {
        todosOsProdutos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderizarCards(todosOsProdutos, adminProductList);
    }, (error) => {
        console.warn("Escuta de produtos encerrada.");
    });
}

export function pararEscutaProdutos() {
    if (unsubProdutos) {
        unsubProdutos();
        unsubProdutos = null;
    }
}

export function renderizarCards(lista, container) {
    if (!container) return;
    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-400 py-10 uppercase font-black text-xs">Nenhum produto encontrado</p>';
        return;
    }

    lista.forEach(p => {
        const estoqueAtual = p.estoque ?? 0;
        const limiteCritico = 5; 
        let img = p.imagem || '';
        
        if (img && !img.startsWith('http')) {
            img = img.includes('assets/images/') ? `../${img}` : `../assets/images/${img}`;
        }

        const saboresTexto = Array.isArray(p.sabores) ? p.sabores.join(', ') : (p.sabores || "");

        const etiquetaAlerta = estoqueAtual <= limiteCritico 
            ? `<span class="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg animate-bounce z-20 border border-white/20 uppercase">
                ⚠️ Baixo: ${estoqueAtual}
               </span>` 
            : '';

        const card = document.createElement('div');
        card.className = "product-card bg-white p-4 rounded-viela shadow-md relative group border border-gray-100 flex flex-col";
        card.innerHTML = `
            ${etiquetaAlerta}
            <div class="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onclick="window.prepararEdicao('${p.id}')" class="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center hover:scale-110">
                    <i class="fas fa-edit text-[10px]"></i>
                </button>
                <button onclick="window.excluirProduto('${p.id}')" class="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110">
                    <i class="fas fa-trash text-[10px]"></i>
                </button>
            </div>
            <div class="w-full h-28 flex items-center justify-center mb-2 bg-gray-50 rounded overflow-hidden">
                <img src="${img}" onerror="this.src='../assets/icons/favicon.png'" class="max-h-full max-w-full object-contain p-2">
            </div>
            <h3 class="font-bold text-[10px] uppercase truncate text-gray-700">${p.nome || 'Sem Nome'}</h3>
            <p class="text-[9px] text-gray-400 italic truncate mb-1">${saboresTexto}</p>
            
            <p class="text-viela-magenta font-black text-sm mb-2">R$ ${Number(p.preco || 0).toFixed(2)}</p>
            
            <div class="mt-auto pt-2 border-t flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <button onclick="window.alterarEstoque('${p.id}', -1)" class="w-5 h-5 bg-gray-200 rounded text-xs hover:bg-red-100">-</button>
                    <span class="text-[10px] font-black ${estoqueAtual <= limiteCritico ? 'text-red-600 animate-pulse' : 'text-gray-800'}">${estoqueAtual}</span>
                    <button onclick="window.alterarEstoque('${p.id}', 1)" class="w-5 h-5 bg-gray-200 rounded text-xs hover:bg-green-100">+</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

export function filtrarProdutos(termo, container) {
    if (!termo || termo.trim() === "") {
        renderizarCards(todosOsProdutos, container);
        return;
    }

    const busca = termo.toLowerCase();
    const filtrados = todosOsProdutos.filter(p => {
        const nome = (p.nome || "").toLowerCase();
        const categoria = (p.categoria || "").toLowerCase();
        const sabores = Array.isArray(p.sabores) ? p.sabores.join(" ").toLowerCase() : (p.sabores || "").toLowerCase();
        
        return nome.includes(busca) || categoria.includes(busca) || sabores.includes(busca);
    });

    renderizarCards(filtrados, container);
}

export async function alterarEstoque(id, mudanca) {
    // AJUSTE 2: Mudado de "produtos" para "products"
    const docRef = doc(db, "products", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        const novoEstoque = Math.max(0, (snap.data().estoque || 0) + mudanca);
        await updateDoc(docRef, { estoque: novoEstoque });
    }
}

export async function prepararEdicao(id) {
    try {
        // AJUSTE 3: Verificado (já estava como products)
        const snap = await getDoc(doc(db, "products", id));
        if (snap.exists()) {
            const p = snap.data();
            
            const campos = {
                'p-nome': p.nome || "",
                'p-preco': p.preco || "",
                'p-estoque': p.estoque || 0,
                'p-categoria': p.categoria || "",
                'p-imagem-url': p.imagem || "",
                'p-sabores': Array.isArray(p.sabores) ? p.sabores.join(', ') : (p.sabores || "")
            };

            for (const [idCampo, valor] of Object.entries(campos)) {
                const el = document.getElementById(idCampo);
                if (el) el.value = valor;
            }
            
            window.idEdicaoAtiva = id;

            const btnSubmit = document.getElementById('btn-submit') || document.querySelector('#product-form button[type="submit"]');
            if (btnSubmit) btnSubmit.innerText = "Atualizar Produto";

            const btnCancelar = document.getElementById('btn-cancelar');
            if (btnCancelar) btnCancelar.classList.remove('hidden');
            
            const formTitle = document.getElementById('form-title');
            if (formTitle) formTitle.innerText = "Editando Produto: " + (p.nome || "");

            const form = document.getElementById('product-form');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                form.classList.add('edit-mode-active');
            }
        }
    } catch (error) {
        console.error("Erro ao preparar edição:", error);
    }
}

export function cancelarEdicao() {
    window.idEdicaoAtiva = null;
    const form = document.getElementById('product-form');
    if (form) {
        form.reset();
        form.classList.remove('edit-mode-active');
    }

    const formTitle = document.getElementById('form-title');
    if (formTitle) formTitle.innerText = "Cadastrar/Editar Produto";

    const btnSubmit = document.getElementById('btn-submit') || document.querySelector('#product-form button[type="submit"]');
    if (btnSubmit) btnSubmit.innerText = "Salvar no Inventário";

    const btnCancelar = document.getElementById('btn-cancelar');
    if (btnCancelar) btnCancelar.classList.add('hidden');
}

export async function excluirProduto(id) {
    if (confirm("Deseja realmente apagar este produto da Adega?")) {
        try {
            // AJUSTE 4: Verificado (já estava como products)
            await deleteDoc(doc(db, "products", id));
        } catch (error) {
            console.error("Erro ao excluir:", error);
        }
    }
}