'use strict';

import { db } from '../../js/firebase.js';
import { 
    collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc, getDoc, increment 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let unsubPedidos = null;

export function escutarPedidos() {
    // Agora buscamos as colunas em vez de uma lista única
    const colPending = document.getElementById('list-pending');
    if (!colPending) return;

    if (unsubPedidos) unsubPedidos();

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    unsubPedidos = onSnapshot(q, (snap) => {
        const pedidos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderizarPedidos(pedidos);
    }, (error) => {
        console.error("Erro na escuta de pedidos:", error);
    });
}

export function pararEscutaPedidos() {
    if (unsubPedidos) {
        unsubPedidos();
        unsubPedidos = null;
    }
}

// NOVA FUNÇÃO: Disparo de Mensagens de Status
function enviarMensagemStatus(telefone, nomeCliente, status) {
    let mensagem = "";
    const saudacao = `Olá *${nomeCliente}*! 🍷 *Adega Viela 9* informa:`;

    if (status === 'preparando') {
        mensagem = `${saudacao}\n\nSeu pedido já está sendo preparado com carinho! ✨`;
    } else if (status === 'entregando') {
        mensagem = `${saudacao}\n\nO seu pedido acabou de sair para entrega! 🛵💨`;
    } else if (status === 'pronto_retirada') {
        mensagem = `${saudacao}\n\nSeu pedido já está pronto! Pode vir retirar aqui na loja. 🏪✅`;
    }

    if (mensagem !== "" && telefone) {
        const telLimpo = telefone.replace(/\D/g, '');
        const url = `https://wa.me/55${telLimpo}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    }
}

function renderizarPedidos(pedidos) {
    // Referência das 4 colunas do seu novo HTML
    const colPending = document.getElementById('list-pending');
    const colPreparing = document.getElementById('list-preparing');
    const colShipping = document.getElementById('list-shipping');
    const colDone = document.getElementById('list-done');

    // Limpa todas as colunas para não duplicar
    [colPending, colPreparing, colShipping, colDone].forEach(col => { if(col) col.innerHTML = ''; });

    if (pedidos.length === 0) return;

    pedidos.forEach(p => {
        const nomeFinal = p.cliente?.nome || "Nome não informado";
        const telFinal = p.cliente?.telefone || "";
        
        const eEntrega = p.entrega?.tipo !== 'retirada';
        const enderecoExibicao = !eEntrega 
            ? "🏪 Retirada na Loja" 
            : `${p.cliente?.rua || 'Rua não inf.'}, ${p.cliente?.numero || 'S/N'} - ${p.cliente?.bairro || ''}`;
        
        const referencia = p.cliente?.referencia || p.cliente?.ref || "";
        const cep = p.cliente?.cep || "";

        let dataEnvio = 'Recentemente';
        if (p.createdAt?.toDate) {
            dataEnvio = p.createdAt.toDate().toLocaleString('pt-BR');
        }

        const statusInfo = {
            'pending': { cor: 'bg-yellow-500', texto: 'PENDENTE', border: 'border-yellow-500' },
            'pendente': { cor: 'bg-yellow-500', texto: 'PENDENTE', border: 'border-yellow-500' },
            'preparando': { cor: 'bg-blue-500', texto: 'PREPARANDO', border: 'border-blue-500' },
            'entregando': { cor: 'bg-purple-500', texto: 'A CAMINHO', border: 'border-purple-500' },
            'concluido': { cor: 'bg-green-600', texto: 'CONCLUÍDO', border: 'border-green-600' }
        };
        
        const statusAtual = (p.status || 'pending').toLowerCase();
        const info = statusInfo[statusAtual] || statusInfo['pending'];

        const valorTrocoPara = parseFloat(p.trocoPara || 0);
        const valorTrocoCalculado = parseFloat(p.trocoCalculado || 0);
        const taxaEntrega = eEntrega ? 5.00 : 0;

        const card = document.createElement('div');
        // Ajustei o padding e o texto para os cards caberem melhor nas colunas estreitas
        card.className = `p-3 mb-3 rounded-lg bg-[#1a1a1a] border-l-4 shadow-xl text-white ${info.border}`;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="text-[8px] text-gray-500 font-mono">ID: ${p.id.substring(0,4).toUpperCase()}</span>
                    <h3 class="text-sm font-bold text-white uppercase break-words">${nomeFinal}</h3>
                </div>
                <div class="text-right">
                    <span class="px-2 py-0.5 rounded ${info.cor} text-[8px] font-black uppercase text-white">
                        ${info.texto}
                    </span>
                </div>
            </div>

            <div class="space-y-1 text-[10px] mb-2 text-gray-300">
                <p class="flex items-center gap-1"><i class="fas fa-phone text-[#e91e63]"></i> ${telFinal}</p>
                <p class="italic text-gray-400 leading-tight"><i class="fas fa-map-marker-alt text-[#e91e63]"></i> ${enderecoExibicao}</p>
                ${referencia ? `<p class="text-[9px] text-yellow-500/80 italic">Ref: ${referencia}</p>` : ''}
            </div>

            <div class="bg-black/20 rounded p-2 mb-2">
                ${p.items ? p.items.map(item => `
                    <div class="flex justify-between text-[10px] mb-0.5">
                        <span>${item.quantity || item.quantidade}x ${item.name || item.nome}</span>
                        <span class="text-gray-400 font-mono">R$ ${((item.price || item.preco) * (item.quantity || item.quantidade)).toFixed(2)}</span>
                    </div>
                `).join('') : ''}
                <div class="flex justify-between font-bold text-[#e91e63] mt-1 border-t border-white/5 pt-1 text-[11px]">
                    <span>Total</span><span>R$ ${parseFloat(p.total || 0).toFixed(2)}</span>
                </div>
            </div>

            ${valorTrocoPara > 0 ? `
                <div class="bg-green-900/20 p-1.5 rounded border border-green-500/20 mb-2 text-[9px]">
                    <p class="text-green-500 font-bold">TROCO PARA R$ ${valorTrocoPara.toFixed(2)}</p>
                    <p class="text-white font-black text-xs">LEVAR: R$ ${valorTrocoCalculado.toFixed(2)}</p>
                </div>
            ` : ''}

            <div class="flex flex-wrap gap-1 mt-2">
                ${(!['preparando', 'entregando', 'concluido'].includes(statusAtual)) ? `
                    <button onclick="window.alterarStatus('${p.id}', 'preparando', '${telFinal}', '${nomeFinal}')" class="bg-blue-600 text-[9px] font-black px-2 py-1.5 rounded flex-1 uppercase text-white">Preparar</button>
                ` : ''}
                
                ${statusAtual === 'preparando' && eEntrega ? `
                    <button onclick="window.alterarStatus('${p.id}', 'entregando', '${telFinal}', '${nomeFinal}')" class="bg-purple-600 text-[9px] font-black px-2 py-1.5 rounded flex-1 uppercase text-white">Entregar</button>
                ` : ''}

                ${statusAtual !== 'concluido' ? `
                    <button onclick="window.marcarComoEntregue('${p.id}', '${telFinal}', '${nomeFinal}', ${eEntrega})" class="bg-green-600 text-white px-2 py-1.5 rounded font-bold text-[9px] uppercase flex-1">
                        Finalizar
                    </button>
                ` : ''}
                
                <button onclick="window.excluirPedido('${p.id}')" class="p-1 text-gray-700 hover:text-red-500">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        // DISTRIBUIÇÃO NAS COLUNAS
        if (statusAtual === 'pending' || statusAtual === 'pendente') colPending.appendChild(card);
        else if (statusAtual === 'preparando') colPreparing.appendChild(card);
        else if (statusAtual === 'entregando') colShipping.appendChild(card);
        else if (statusAtual === 'concluido') colDone.appendChild(card);
    });
}

// FUNÇÕES DE AÇÃO COM MENSAGEM AUTOMÁTICA
window.alterarStatus = async (id, novoStatus, telefone, nome) => {
    try {
        const docRef = doc(db, "orders", id);
        await updateDoc(docRef, { status: novoStatus });
        enviarMensagemStatus(telefone, nome, novoStatus);
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
    }
};

export async function marcarComoEntregue(id, telefone, nome, eEntrega) {
    try {
        const pedidoRef = doc(db, "orders", id);
        const pedidoSnap = await getDoc(pedidoRef);
        if (!pedidoSnap.exists()) return;
        const dadosPedido = pedidoSnap.data();

        if (dadosPedido.status === 'concluido') return;

        if (dadosPedido.items && Array.isArray(dadosPedido.items)) {
            const promessasEstoque = dadosPedido.items.map(async (item) => {
                const idProduto = item.productId || item.id;
                const qtd = parseInt(item.quantity || item.quantidade || 0);
                if (idProduto) {
                    const produtoRef = doc(db, "products", idProduto);
                    await updateDoc(produtoRef, { estoque: increment(-qtd) });
                }
            });
            await Promise.all(promessasEstoque);
        }

        await updateDoc(pedidoRef, { status: 'concluido' });
        
        if (!eEntrega) {
            enviarMensagemStatus(telefone, nome, 'pronto_retirada');
        }
        
        alert("Pedido concluído e estoque atualizado!");
    } catch (error) {
        console.error("Erro ao finalizar:", error);
    }
}

export async function excluirPedido(id) {
    if(confirm("Deseja apagar este pedido da Adega?")) {
        try {
            await deleteDoc(doc(db, "orders", id));
        } catch (e) { console.error(e); }
    }
}

window.excluirPedido = excluirPedido;
window.marcarComoEntregue = marcarComoEntregue;