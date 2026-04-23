'use strict';

/**
 * CHECKOUT & MODAL
 * Lógica do modal de finalização, Firestore e WhatsApp
 */

import { State, formatarPreco, Config, el } from './state.js';
import { Cart } from './cart.js';

// 🔥 FIREBASE
import { db } from "./firebase.js";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================================
// 🔥 SALVAR PEDIDO NO FIRESTORE
// ================================
async function salvarPedidoNoFirestore(dadosCliente, opcao, taxaEntrega, totalFinal) {
    try {
        const items = Object.values(Cart.cart).map(i => ({
            productId: i.id,
            name: i.nome,
            price: i.preco,
            quantity: i.quantidade,
            sabor: i.sabor || 'N/A'
        }));

        // 💰 TROCO
        const valorTroco = (dadosCliente.pag === 'Dinheiro' && el.inputTroco?.value)
            ? Number(el.inputTroco.value.replace(',', '.'))
            : 0;

        const trocoCalculado = valorTroco > 0
            ? Number((valorTroco - totalFinal).toFixed(2))
            : 0;

        const pedidoData = {
            cliente: {
                nome: dadosCliente.nome,
                telefone: dadosCliente.tel,
                cep: el.clienteCep?.value || '',
                rua: el.clienteRua?.value || '',
                numero: el.clienteNumero?.value || '',
                bairro: el.clienteBairro?.value || '',
                cidade: el.clienteCidade?.value || '',
                referencia: el.clienteReferencia?.value || ''
            },
            entrega: {
                tipo: opcao,
                taxa: taxaEntrega
            },
            pagamento: dadosCliente.pag,
            trocoPara: valorTroco,
            trocoCalculado: trocoCalculado,
            items,
            total: totalFinal,
            status: "pending",
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "orders"), pedidoData);
        console.log("✅ Pedido salvo no Firestore com sucesso!");

    } catch (error) {
        console.error("❌ Erro ao salvar pedido no Firestore:", error);
    }
}

// ================================
// VERIFICA PEDIDO MÍNIMO
// ================================
export function verificarPedidoMinimo() {
    if (!el.textoInformativo) return;
    
    const opcao = document.querySelector('input[name="opcaoEnvio"]:checked')?.value;
    const isRetirada = opcao === 'retirada';

    if (opcao === 'entrega' && State.totalGlobal < Config.PEDIDO_MINIMO_ENTREGA) {
        const falta = (Config.PEDIDO_MINIMO_ENTREGA - State.totalGlobal);
        el.textoInformativo.innerHTML = `⚠️ <strong>Pedido mínimo para entrega:</strong> R$ 25,00<br>Faltam apenas <strong>${formatarPreco(falta)}</strong> para liberar.`;
        el.textoInformativo.style.borderLeftColor = '#ff9800';
    } else if (opcao === 'entrega') {
        el.textoInformativo.innerHTML = `📍 <strong>Entrega:</strong><br>Informe seu endereço abaixo.<br><small>Taxa fixa: ${formatarPreco(Config.TAXA_ENTREGA_FIXA)}.</small>`;
        el.textoInformativo.style.borderLeftColor = '#bb06ac';
    } else {
        el.textoInformativo.innerHTML = `🏪 <strong>Retirada na loja:</strong><br>${Config.ENDERECO_LOJA}<br>${Config.HORARIO_FUNCIONAMENTO}`;
        el.textoInformativo.style.borderLeftColor = '#28a745';
    }

    if (el.enderecoGroup) {
        el.enderecoGroup.classList.toggle('hidden', isRetirada);
    }
    atualizarResumo();
}

// ================================
// RESUMO FINANCEIRO NO MODAL
// ================================
export function atualizarResumo() {
    if (!el.resumoProdutos || !el.resumoEntrega || !el.resumoTotal) return;
    
    const opcao = document.querySelector('input[name="opcaoEnvio"]:checked')?.value;
    const isRet = opcao === 'retirada';
    const taxa = isRet ? 0 : Config.TAXA_ENTREGA_FIXA;

    el.resumoProdutos.textContent = formatarPreco(State.totalGlobal);
    el.resumoEntrega.textContent = isRet ? 'Grátis' : formatarPreco(taxa);
    el.resumoTotal.textContent = formatarPreco(State.totalGlobal + taxa);
}

// ================================
// LÓGICA DO MODAL
// ================================
export function abrirModal() {
    if (State.totalGlobal === 0) return alert('🛒 Adicione produtos antes de finalizar.');
    
    el.modal?.classList.add('active');
    el.modal?.removeAttribute('aria-hidden');
    el.modal?.removeAttribute('inert');
    
    verificarPedidoMinimo();
    atualizarResumo();

    setTimeout(() => el.clienteNome?.focus(), 300);
}

export function fecharModal() {
    el.modal?.classList.remove('active');
    el.modal?.setAttribute('aria-hidden', 'true');
    el.modal?.setAttribute('inert', '');
}

// ================================
// 🔥 ENVIAR WHATSAPP + SALVAR
// ================================
export async function enviarWhatsApp() {
    const opcao = document.querySelector('input[name="opcaoEnvio"]:checked')?.value || 'entrega';
    const nome = el.clienteNome?.value.trim() || '';
    const tel = el.clienteTelefone?.value.trim() || '';
    const pag = el.formaPagamento?.value || '';
    
    const rua = el.clienteRua?.value.trim() || '';
    const num = el.clienteNumero?.value.trim() || '';
    const bairro = el.clienteBairro?.value.trim() || '';
    const ref = el.clienteReferencia?.value.trim() || '';
    const cep = el.clienteCep?.value.trim() || '';

    if (!nome || !tel || !pag) return alert('⚠️ Preencha Nome, Telefone e Forma de Pagamento!');
    
    if (opcao === 'entrega') {
        if (State.totalGlobal < Config.PEDIDO_MINIMO_ENTREGA) {
            return alert(`🚚 Pedido mínimo para entrega é ${formatarPreco(Config.PEDIDO_MINIMO_ENTREGA)}.`);
        }
        if (!rua || !num || !bairro) {
            return alert('⚠️ Por favor, preencha o endereço completo!');
        }
    }

    const taxaEntrega = (opcao === 'entrega') ? Config.TAXA_ENTREGA_FIXA : 0;
    const totalFinal = State.totalGlobal + taxaEntrega;

    // 🚨 BLOQUEIO SE DINHEIRO INSUFICIENTE
    let valorPago = 0;
    if (pag === 'Dinheiro' && el.inputTroco?.value) {
        valorPago = Number(el.inputTroco.value.replace(',', '.'));

        if (valorPago < totalFinal) {
            return alert("⚠️ O valor para troco é menor que o total do pedido.");
        }
    }

    // --- 🔥 INCLUSÃO: TRAVA DE ESTOQUE ANTES DE FINALIZAR ---
    for (const item of Object.values(Cart.cart)) {
        if (item.id) {
            const pRef = doc(db, "products", item.id);
            const pSnap = await getDoc(pRef);
            
            if (pSnap.exists()) {
                const estoqueDisponivel = pSnap.data().estoque ?? 0;
                if (estoqueDisponivel < item.quantidade) {
                    return alert(`❌ ESTOQUE INSUFICIENTE!\nO item "${item.nome}" só tem ${estoqueDisponivel} unidade(s) disponível(is) no momento.`);
                }
            }
        }
    }

    // 1. Salva no Firestore
    await salvarPedidoNoFirestore({ nome, tel, pag }, opcao, taxaEntrega, totalFinal);

    // 2. Mensagem WhatsApp
    let msg = `🛒 *NOVO PEDIDO - ADEGA VIELA 9*\n\n`;
    msg += `👤 *Cliente:* ${nome}\n`;
    msg += `📱 *Telefone:* ${tel}\n`;

    if (opcao === 'entrega') {
        msg += `📍 *Endereço:* ${rua}, Nº ${num}\n`;
        msg += `📌 *Bairro:* ${bairro}\n`;
        if (ref) msg += `🗺️ *Ref:* ${ref}\n`;
        msg += `📮 *CEP:* ${cep}\n`;
    } else {
        msg += `🏪 *Tipo:* Retirada na Loja\n`;
    }

    msg += `\n🍻 *Itens:*\n━━━━━━━━━━━━━━━\n`;
    Object.values(Cart.cart).forEach(i => {
        msg += `• ${i.nome} ${i.sabor ? `(${i.sabor})` : ''} x${i.quantidade} — ${formatarPreco(i.preco * i.quantidade)}\n`;
    });
    msg += `━━━━━━━━━━━━━━━\n`;

    msg += `💰 *Subtotal:* ${formatarPreco(State.totalGlobal)}\n`;
    if (taxaEntrega > 0) msg += `🚚 *Entrega:* ${formatarPreco(taxaEntrega)}\n`;
    msg += `🧾 *TOTAL: ${formatarPreco(totalFinal)}*\n`;
    msg += `💳 *Pagamento:* ${pag}\n`;

    // 💵 TROCO NO WHATSAPP
    if (pag === 'Dinheiro' && valorPago > 0) {
        const troco = Number((valorPago - totalFinal).toFixed(2));
        msg += `💵 *Troco para:* ${formatarPreco(valorPago)}\n`;
        msg += `💰 *Troco:* ${formatarPreco(troco)}\n`;
    }

    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    msg += `\n⏰ *Pedido às:* ${hora}`;

    const linkZap = `https://wa.me/${Config.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(linkZap, '_blank');

    Cart.clear();
    fecharModal();
    location.reload();
}

// ================================
// 📍 BUSCA DE CEP
// ================================
export async function buscarCep() {
    const cepInput = el.clienteCep?.value.replace(/\D/g, '');
    
    if (!cepInput || cepInput.length !== 8) {
        return alert("Digite um CEP válido com 8 números.");
    }

    try {
        if (el.btnBuscaCep) el.btnBuscaCep.textContent = "⌛...";

        const res = await fetch(`https://viacep.com.br/ws/${cepInput}/json/`);
        const data = await res.json();

        if (data.erro) {
            alert("❌ CEP não encontrado!");
            return;
        }

        if (el.clienteRua) el.clienteRua.value = data.logradouro || '';
        if (el.clienteBairro) el.clienteBairro.value = data.bairro || '';
        if (el.clienteCidade) el.clienteCidade.value = `${data.localidade} - ${data.uf}`;
        
        el.clienteNumero?.focus();

    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar CEP.");
    } finally {
        if (el.btnBuscaCep) el.btnBuscaCep.textContent = "🔍";
    }
}