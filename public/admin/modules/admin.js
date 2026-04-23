'use strict';

import { auth, db } from '../../js/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// IMPORTAÇÃO DOS SEUS MÓDULOS
import { initTabs } from '../modules/ui.js';
import { login, logout } from '../modules/auth.js';
import { escutarProdutos, prepararEdicao, excluirProduto, alterarEstoque, cancelarEdicao, filtrarProdutos } from '../modules/produtos.js';
import { escutarPedidos, excluirPedido, marcarComoEntregue } from '../modules/pedidos.js';



const loginSection = document.getElementById('login-section');
const adminPanel = document.getElementById('admin-panel');

// --- 1. CONTROLE DE ACESSO ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usa a classe correta conforme seu HTML/CSS
        loginSection.classList.add('hidden');
        adminPanel.classList.remove('hidden-panel');
        
        // INICIALIZA OS MÓDULOS
        if (typeof initTabs === 'function') initTabs();
        escutarProdutos();
        escutarPedidos();
    } else {
        loginSection.classList.remove('hidden');
        adminPanel.classList.add('hidden-panel');
    }
});

// --- 2. LIGAÇÃO COM O HTML (Escopo Global para botões dinâmicos) ---
// Isso resolve os erros de "is not a function" nos botões de Pedidos e Produtos
window.prepararEdicao = prepararEdicao;
window.excluirProduto = excluirProduto;
window.alterarEstoque = alterarEstoque;
window.cancelarEdicao = cancelarEdicao;
window.excluirPedido = excluirPedido;
window.marcarComoEntregue = marcarComoEntregue; 

// --- 3. LÓGICA DO FORMULÁRIO DE PRODUTOS ---
const productForm = document.getElementById('product-form');
if (productForm) {
    productForm.onsubmit = async (e) => {
        e.preventDefault();

        // Tratamento do campo Sabores (Transforma texto em Array para o filtro do cliente)
        const saboresRaw = document.getElementById('p-sabores').value;
        const saboresArray = saboresRaw 
            ? saboresRaw.split(',').map(s => s.trim()).filter(s => s !== "") 
            : [];

        const dadosProduto = {
            nome: document.getElementById('p-nome').value,
            sabores: saboresArray,
            preco: parseFloat(document.getElementById('p-preco').value),
            estoque: parseInt(document.getElementById('p-estoque').value) || 0,
            categoria: document.getElementById('p-categoria').value,
            imagem: document.getElementById('p-imagem-url').value || 'assets/images/em-breve.webp',
            ultimaAtualizacao: serverTimestamp()
        };

        try {
            // Verifica se está em modo de edição (usando a variável global do módulo de produtos)
            if (window.idEdicaoAtiva) {
                const docRef = doc(db, "products", window.idEdicaoAtiva);
                await updateDoc(docRef, dadosProduto);
                alert("Produto atualizado com sucesso!");
            } else {
                dadosProduto.dataCriacao = serverTimestamp();
                await addDoc(collection(db, "products"), dadosProduto);
                alert("Produto cadastrado com sucesso!");
            }
            cancelarEdicao(); 
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar produto. Verifique o console.");
        }
    };
}

// --- 4. LÓGICA DA BARRA DE PESQUISA ---
const campoBusca = document.getElementById('admin-search'); // Atualizado para o ID do seu HTML
if (campoBusca) {
    campoBusca.oninput = (e) => {
        const container = document.getElementById('admin-product-list');
        if (typeof filtrarProdutos === 'function') {
            filtrarProdutos(e.target.value, container);
        }
    };
}

// --- 5. EVENTOS DE AUTENTICAÇÃO ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const pass = document.getElementById('admin-password').value;
        login(email, pass);
    };
}

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.onclick = (e) => {
        e.preventDefault();
        logout();
    };
}

window.resetarFormulario = function() {
    // Adicionei 'p-sabores' (ou o ID que você usa para sabores) na lista abaixo
    const campos = ['p-nome', 'p-preco', 'p-estoque', 'p-imagem-url', 'p-categoria', 'p-sabores'];
    
    campos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (elemento.tagName === 'SELECT') {
                elemento.selectedIndex = 0; 
            } else {
                elemento.value = ''; 
            }
        }
    });

    const btnSubmit = document.getElementById('btn-submit');
    if (btnSubmit) {
        btnSubmit.innerText = 'Salvar Produto';
    }

    console.log("Edição/Cadastro cancelado: inclusive sabores.");
};

