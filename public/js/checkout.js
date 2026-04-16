'use strict';

/**
 * CHECKOUT & MODAL
 * Lógica do modal de finalização e WhatsApp
 */

import { State, $, $$, formatarPreco, Config, el } from './state.js';
import { Cart } from './cart.js';
import { renderizarProdutos } from './render.js';
import { fecharCarrinho } from './ui.js';

// Verifica regras de pedido mínimo e atualiza UI
export function verificarPedidoMinimo() {
    if (!el.textoInformativo) return;
    
    const opcao = document.querySelector('input[name="opcaoEnvio"]:checked')?.value;
    const isRetirada = opcao === 'retirada';

    if (opcao === 'entrega' && State.totalGlobal < Config.PEDIDO_MINIMO_ENTREGA) {
        const falta = (Config.PEDIDO_MINIMO_ENTREGA - State.totalGlobal)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        el.textoInformativo.innerHTML = `⚠️ <strong>Pedido mínimo para entrega:</strong> R$ 25,00<br>Faltam apenas <strong>${falta}</strong> para liberar.`;
        el.textoInformativo.style.borderLeftColor = '#ff9800';
    } else if (opcao === 'entrega') {
        el.textoInformativo.innerHTML = `📍 <strong>Entrega:</strong><br>Informe seu endereço no próximo passo.<br><small>Taxa fixa de entrega: ${formatarPreco(Config.TAXA_ENTREGA_FIXA)}.</small>`;
        el.textoInformativo.style.borderLeftColor = '#bb06ac';
    } else {
        el.textoInformativo.innerHTML = `🏪 <strong>Retirada na loja:</strong><br>${Config.ENDERECO_LOJA}<br>${Config.HORARIO_FUNCIONAMENTO}`;
        el.textoInformativo.style.borderLeftColor = '#28a745';
    }

    // Controla campo endereço
   // Controla campo endereço
if (el.enderecoGroup) {
    if (isRetirada) {
        el.enderecoGroup.classList.add('hidden');

        if (el.clienteRua) el.clienteRua.value = '';
        if (el.clienteNumero) el.clienteNumero.value = '';
        if (el.clienteComplemento) el.clienteComplemento.value = '';
        if (el.clienteReferencia) el.clienteReferencia.value = '';

        if (el.enderecoHelp) {
            el.enderecoHelp.textContent = 'Não necessário para retirada.';
        }
    } else {
        el.enderecoGroup.classList.remove('hidden');

        if (el.enderecoHelp) {
            el.enderecoHelp.textContent = 'Campo obrigatório para entregas.';
        }
    }
}
    atualizarResumo();
}

// Atualiza resumo do pedido no modal
export function atualizarResumo() {
    if (!el.resumoProdutos || !el.resumoEntrega || !el.resumoTotal) return;
    
    const opcao = document.querySelector('input[name="opcaoEnvio"]:checked')?.value;
    const isRet = opcao === 'retirada';
    const taxa = isRet ? 0 : Config.TAXA_ENTREGA_FIXA;

    el.resumoProdutos.textContent = formatarPreco(State.totalGlobal);
    el.resumoEntrega.textContent = isRet ? 'Retirada na loja' : formatarPreco(taxa);
    el.resumoTotal.textContent = formatarPreco(State.totalGlobal + taxa);
}

// Abre modal de checkout
export function abrirModal() {
    if (State.totalGlobal === 0) return alert('🛒 Adicione produtos antes de finalizar.');

    if (el.checkoutForm) el.checkoutForm.reset();
    const tipoEntrega = document.querySelector('#tipoEntrega');
    if (tipoEntrega) tipoEntrega.checked = true;
    
    el.trocoContainer?.classList.add('hidden');
    if (el.valorTroco) el.valorTroco.textContent = '';

    verificarPedidoMinimo();
    atualizarResumo();

    el.modal?.classList.add('active');
    el.modal?.setAttribute('aria-hidden', 'false');
}

// Fecha modal
export function fecharModal() {
    el.modal?.classList.remove('active');
    el.modal?.setAttribute('aria-hidden', 'true');
}

// Envia pedido via WhatsApp
export function enviarWhatsApp() {
    const opcao = document.querySelector('input[name="opcaoEnvio"]:checked')?.value || 'entrega';
    const nome = el.clienteNome ? el.clienteNome.value.trim() : '';
    const tel = el.clienteTelefone ? el.clienteTelefone.value.trim() : '';
    const pag = el.formaPagamento ? el.formaPagamento.value : '';

    // Validações básicas
    if (!nome || !tel || !pag) return alert('⚠️ Preencha: Nome, Telefone e Forma de Pagamento!');
    
    if (opcao === 'entrega' && State.totalGlobal < Config.PEDIDO_MINIMO_ENTREGA) {
        return alert(`🚚 Pedido mínimo para entrega é R$ 25,00.\nAdicione mais itens ou escolha "Retirada".`);
    }

    if (opcao === 'entrega') {
        if (!el.clienteCep.value || el.clienteCep.value.length < 9) {
            return alert('📍 Informe um CEP válido!');
        }
        if (!el.clienteRua.value) {
            return alert('📍 Busque o CEP antes de continuar!');
        }
        if (!el.clienteNumero.value.trim()) {
            return alert('🏠 Informe o número da residência!');
        }
    }

    if (pag === 'Dinheiro' && !el.inputTroco?.value.trim()) {
        return alert('💵 Informe o valor para troco!');
    }

    // Calcula totais
    const taxaEntrega = (opcao === 'entrega' && State.totalGlobal >= Config.PEDIDO_MINIMO_ENTREGA) 
        ? Config.TAXA_ENTREGA_FIXA : 0;
    const totalFinal = State.totalGlobal + taxaEntrega;
    
    // Monta mensagem
    let msg = `🛒 *NOVO PEDIDO - ADEGA VIELA 9*\n\n`;
    msg += `👤 *Cliente:* ${nome.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}\n`;
    msg += `📱 *Telefone:* ${tel.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')}\n`;
    
    if (opcao === 'retirada') {
        msg += `🏪 *Retirada na loja*\n📍 ${Config.ENDERECO_LOJA}\n🕒 ${Config.HORARIO_FUNCIONAMENTO}\n`;
    } else {
        const comp = el.clienteComplemento?.value.trim();
        const ref = el.clienteReferencia?.value.trim();
        
        msg += `🚚 *Entrega:* ${taxaEntrega > 0 ? formatarPreco(taxaEntrega) : 'Grátis'}\n`;
        msg += `📍 *Endereço:* ${el.clienteRua.value}, Nº ${el.clienteNumero.value.trim()}`;
        if (comp) msg += ` - ${comp}`;
        msg += `\n📌 ${el.clienteBairro.value} - ${el.clienteCidade.value}`;
        if (ref) msg += `\n🗺️ Ref: ${ref}`;
        msg += `\n📮 CEP: ${el.clienteCep.value}\n`;
    }
    
    msg += `\n🍻 *Itens:*\n━━━━━━━━━━━━━━━\n`;
    Object.values(Cart.cart).forEach(i => {
        msg += `• ${i.nome}${i.sabor ? ` (${i.sabor})` : ''} x${i.quantidade} — ${formatarPreco(i.preco * i.quantidade)}\n`;
    });
    msg += `━━━━━━━━━━━━━━━\n`;
    msg += `💰 *Subtotal:* ${formatarPreco(State.totalGlobal)}\n`;
    
    if (opcao === 'entrega') {
        msg += `🚚 *Entrega:* ${formatarPreco(taxaEntrega)}\n`;
    }
    msg += `🧾 *TOTAL:* *${formatarPreco(totalFinal)}*\n\n`;
    msg += `💳 *Pagamento:* ${pag}\n`;

    if (pag === 'Dinheiro') {
        const trocoVal = parseFloat(el.inputTroco.value.replace(',', '.'));
        const trocoCalc = trocoVal - totalFinal;
        msg += `💵 *Troco para:* ${formatarPreco(trocoVal)}\n`;
        msg += trocoCalc >= 0 
            ? `💰 *Troco:* ${formatarPreco(trocoCalc)}\n` 
            : `⚠️ *Valor insuficiente para troco!*\n`;
    }

    const agora = new Date();
    msg += `\n⏰ Pedido: ${String(agora.getHours()).padStart(2,'0')}:${String(agora.getMinutes()).padStart(2,'0')}`;

    // Limpa carrinho e envia
    Cart.clear();
    renderizarProdutos();
    fecharModal();
    fecharCarrinho();

    window.open(`https://wa.me/${Config.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Busca CEP via ViaCEP
export async function buscarCep() {
    const cep = el.clienteCep.value.replace(/\D/g, '');
    
    el.cepError.style.display = 'none';
    el.cepSuccess.style.display = 'none';

    if (cep.length !== 8) {
        el.cepError.style.display = 'block';
        return;
    }

    el.cepLoading.style.display = 'flex';

    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();

        if (data.erro) throw new Error();

        el.clienteRua.value = data.logradouro || '';
        el.clienteBairro.value = data.bairro || '';
        el.clienteCidade.value = `${data.localidade} - ${data.uf}` || '';

        el.cepSuccess.style.display = 'block';
        State.cepValido = true;
        State.cepDados = data;

    } catch {
        el.clienteRua.value = '';
        el.clienteBairro.value = '';
        el.clienteCidade.value = '';
        el.cepError.style.display = 'block';
        State.cepValido = false;
    } finally {
        el.cepLoading.style.display = 'none';
    }
}