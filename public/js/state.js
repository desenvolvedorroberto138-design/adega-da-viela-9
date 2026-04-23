'use strict';

/**
 * ESTADO GLOBAL & UTILITÁRIOS
 * Módulo central para variáveis de estado e funções utilitárias
 */

// Estado da aplicação
export const State = {
    categoriaAtiva: 'Todos',
    termoBusca: '',
    ordenacaoAtual: 'name-asc',
    viewMode: 'grid',
    totalGlobal: 0,
    cepValido: false,
    cepDados: null,
};

// Configurações fixas
export const Config = {
    TAXA_ENTREGA_FIXA: 5.00,
    ENDERECO_LOJA: 'Rua Daniel dos Santos, Viela Nove, 763 - Suzano',
    HORARIO_FUNCIONAMENTO: 'Aberto das 18h às 02h',
    WHATSAPP_NUMBER: '5511969702745',
    PEDIDO_MINIMO_ENTREGA: 25.00,
};

// Seletores DOM (shortcuts)
export const $ = (s) => document.querySelector(s);
export const $$ = (s) => document.querySelectorAll(s);

// Utilitários de Storage
export function safeGet(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } 
    catch { return fallback; }
}

export function safeSet(key, val) { 
    try { localStorage.setItem(key, JSON.stringify(val)); } 
    catch {} 
}

// Formatadores
export function formatarPreco(v) {
    const valor = Number(v);

    if (!Number.isFinite(valor)) {
        return 'R$ 0,00';
    }

    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

export function gerarChave(id, sabor = '') { 
    return `${id}_${sabor || 'padrao'}`; 
}

// Cálculo de taxa de entrega
export function calcularTaxaEntrega(endereco = '', isRetirada = false) {
    if (isRetirada) return { taxa: 0, tipo: 'retirada', desc: 'Retirada na loja' };
    return { 
        taxa: Config.TAXA_ENTREGA_FIXA, 
        tipo: 'fixa', 
        desc: `Taxa fixa: ${formatarPreco(Config.TAXA_ENTREGA_FIXA)}` 
    };
}

// Cache de elementos DOM (será preenchido no init)
export const el = {};