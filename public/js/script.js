'use strict';

// ====================
// 1. DADOS DOS PRODUTOS
// ====================
const produtos = [
    { id: 1, nome: 'SNICKERS 42G', codigo: 'SNK001', preco: 4.50, imagem: 'image/merce/snickers-45g.webp', categoria: 'Doces' },
    { id: 2, nome: 'COCA-COLA 350ML', codigo: 'CCA002', preco: 4.20, imagem: 'image/beer-no-alcool/coca-cola-lata-350-ml.jfif', categoria: 'Refrigerantes Lata' },
    { id: 3, nome: 'CERVEJA SKOL 350ML', codigo: 'BRH003', preco: 3.80, imagem: 'image/cerveja/skol-lata-350-ml.webp', categoria: 'Cervejas Avulsas' },
    { id: 4, nome: 'TORCIDA 60G', codigo: 'TOR004', preco: 3.00, imagem: 'image/merce/torcida-saladinhos.webp', categoria: 'Salgadinhos', sabores: ['Churrasco', 'Bacon', 'Pimenta Mexicana', 'Cebola', 'Vinagrete', 'Costelinha'] },
    { id: 5, nome: 'WHISKY JACK DANIELS 1L', codigo: 'JCK005', preco: 149.90, imagem: 'image/cachaca/whisky_jack_daniels_1000ml.webp', categoria: 'Whisky' },
    { id: 6, nome: 'HEINEKEN 295ML', codigo: 'HEI006', preco: 12.90, imagem: 'image/cerveja/cerveja-long-neck-heineken.webp', categoria: 'Cervejas Avulsas' },
    { id: 7, nome: 'COCA-COLA RETORNAVEL 2L', codigo: 'COC007', preco: 9.00, imagem: 'image/beer-no-alcool/coca-retornavel-2l.jfif', categoria: 'Refrigerantes 2L' },
    { id: 8, nome: 'CERVEJA ORIGINAL LATA 269 ML', codigo: 'CERV008', preco: 4.00, imagem: 'image/cerveja/original-lata-269-ml.webp', categoria: 'Cervejas Avulsas' },
    { id: 9, nome: 'CERVEJA IMPÉRIO LATA 350ML', codigo: 'IMP009', preco: 3.50, imagem: 'image/cerveja/cerveja_imperio_puro_malte_pilsen_350ml_lata.jpg', categoria: 'Cervejas Avulsas' },
    { id: 10, nome: 'DOSE GIN BEEFEATER PINK', codigo: 'BEEPK0010', preco: 44.90, imagem: 'image/cachaca/doses/dose-beefeater-pink-700ml.jfif', categoria: 'Doses' },
    { id: 11, nome: 'GIN ETERNITY MAÇA VERDE 900ML', codigo: 'GIN0011', preco: 25.00, imagem: 'image/cachaca/gin-invictus-maça-verde-900ml.webp', categoria: 'Gin' },
    { id: 12, nome: 'GIN ETERNITY MARACUJÁ 900ML', codigo: 'GIN0012', preco: 25.00, imagem: 'image/cachaca/gin-invictus-maracuja-900ml.webp', categoria: 'Gin' },
    { id: 13, nome: 'GIN ETERNITY ROYALE 900ML', codigo: 'GIN0013', preco: 25.00, imagem: 'image/cachaca/gin-invictus-royale-900ml.jpg', categoria: 'Gin' },
    { id: 14, nome: 'ZIGGY', codigo: 'ZIG0014', preco: 12.50, imagem: 'image/taba/Ziggy-sabores.jpg', categoria: 'Essências', sabores: ['Happy Berry', 'Cherry Starburst', 'Watermelon Bomb', 'Red Lemonade', 'Maracujá', 'Burley Mint', 'Açaí', 'Banana Tropical', 'Caju Tropical', 'Laranjola', 'Duas Maçãs Verde'] },
    { id: 15, nome: 'CARVÃO ZOMO UNIDADE', codigo: 'CAR0015', preco: 0.80, imagem: 'image/taba/carvao-avulso-zomo.webp', categoria: 'Carvão' },
    { id: 16, nome: 'CARVÃO ZOMO 1KG', codigo: 'CAR0016', preco: 27.90, imagem: 'image/taba/carvao-zomo-1kg.webp', categoria: 'Carvão' },
    { id: 17, nome: 'CIGARRO ROTHMANS MAÇO BLUE', codigo: 'CIC0017', preco: 20.50, imagem: 'image/taba/cigarro_rothmans_blue_global.jpg', categoria: 'Cigarros' },
    { id: 18, nome: 'CIGARRO ROTHMANS MAÇO RED', codigo: 'CIC0018', preco: 22.80, imagem: 'image/taba/cigarro_rothmans_red_global.jpg', categoria: 'Cigarros' },
    { id: 19, nome: 'GUARANÁ 2L', codigo: 'GUA0019', preco: 7.90, imagem: 'image/cachaca/em-breve.webp', categoria: 'Refrigerantes 2L' },
    { id: 20, nome: 'NESCAU 400G', codigo: 'NES0020', preco: 17.50, imagem: 'image/cachaca/em-breve.webp', categoria: 'Outros' },
    { id: 21, nome: 'ENERGÉTICO RED BULL', codigo: 'RDB0021', preco: 9.80, imagem: 'image/cachaca/em-breve.webp', categoria: 'Energéticos' },
    { id: 22, nome: 'CHOPP VINHO DRAFT 600ML', codigo: 'DRA0022', preco: 12.90, imagem: 'image/cachaca/vinho-draft-600ml.webp', categoria: 'Vinho' },
    { id: 23, nome: 'COMBO PASSAPORT', codigo: 'COM0023', preco: 258.00, imagem: 'image/combo-bebida/passaport-red-balde.jpg', categoria: 'Combos-bebidas' },
    { id: 24, nome: 'COMBO JACK DANIELS + REDBULL + GELO', codigo: 'COM0024', preco: 286.00, imagem: 'image/combo-bebida/jack-red-balde.webp', categoria: 'Combos-bebidas' },
    { id: 25, nome: 'COMBO BEEFEATER PINK + REDBULL + GELO', codigo: 'COM0025', preco: 270.00, imagem: 'image/combo-bebida/images.jfif', categoria: 'Combos-bebidas' },
    { id: 26, nome: 'CACHAÇA 51 965ML', codigo: 'CAC0026', preco: 12.50, imagem: 'image/cachaca/Cachaca-Tradicional-51-Garrafa-965ml.webp', categoria: 'Cachaças' },
    { id: 27, nome: 'CACHAÇA VEIO BARREIRO 910ML', codigo: 'CAC0027', preco: 15.80, imagem: 'image/cachaca/beb10-velho-barreiro-910ml.webp', categoria: 'Cachaças' },
    { id: 28, nome: 'DRINK GOURMET LARANJA 700ML', codigo: 'DRK0028', preco: 35.00, imagem: 'image/cachaca/drink-goumert/drink-laranja.png', categoria: 'Drinks Gourmet' },
    { id: 29, nome: 'DRINK GOURMET MORANGO 700ML', codigo: 'DRK0029', preco: 35.00, imagem: 'image/cachaca/drink-goumert/drink-morango.png', categoria: 'Drinks Gourmet' },
    { id: 30, nome: 'ORIGINAL FARDO 12 UNI', codigo: 'FRDORI0030', preco: 37.90, imagem: 'image/cerveja/pack/fardo-original.jfif', categoria: 'Fardos' },
    { id: 31, nome: 'PACK HEINEKEN 6 UNI', codigo: 'PCKHEI0031', preco: 42.50, imagem: 'image/cerveja/pack/cerveja-heineken-com-6-926x926-fardo.jpg', categoria: 'Fardos' },
    { id: 32, nome: 'FARDO SKOL 12UNI', codigo: 'SKOL0032', preco: 35.80, imagem: 'image/cerveja/pack/fardo-skol-12-uni.jfif', categoria: 'Fardos' },
    { id: 33, nome: 'CERVEJA BRAHMA 350ML LATA', codigo: 'BRH0033', preco: 4.00, imagem: 'image/cerveja/brahma-lata-350ml.webp', categoria: 'Cervejas Avulsas' },
    { id: 34, nome: 'CERVEJA AMSTEL 350ML LATA', codigo: 'AMS0034', preco: 4.00, imagem: 'image/cerveja/cerveja-amstel-lata-350ml..png', categoria: 'Cervejas Avulsas' },
    { id: 35, nome: 'CERVEJA ITAIPAVA 269ML LATA', codigo: 'ITA0035', preco: 3.00, imagem: 'image/cerveja/lata-Itaipava-269ml.png', categoria: 'Cervejas Avulsas' },
    { id: 36, nome: 'CERVEJA BUDWEISER 269ML LATA', codigo: 'BDW0036', preco: 4.00, imagem: 'image/cerveja/lata-Budweiser-269ml.png', categoria: 'Cervejas Avulsas' },
    { id: 37, nome: 'COMBO ESSÊNCIA 01', codigo: 'CM010037', preco: 25.00, imagem: 'image/combo/super-combo--38.webp', categoria: 'Combos Essências', sabores: ['Mix Básico'] },
    { id: 38, nome: 'COMBO ESSÊNCIA 02', codigo: 'CN020038', preco: 45.00, imagem: 'image/combo/super-combo-essencias-86.webp', categoria: 'Combos Essências', sabores: ['Mix Premium'] },
    { id: 39, nome: 'COMBO ESSÊNCIA 03', codigo: 'CM03OO39', preco: 50.00, imagem: 'image/combo/super-combo-170.webp', categoria: 'Combos Essências', sabores: ['Mix Deluxe'] },
    { id: 40, nome: 'ZOMO', codigo: 'ZOM0040', preco: 12.50, imagem: 'image/taba/zomo-sabores.jpg', categoria: 'Essências', sabores: ['Strong Cherry', 'Strong Lemon', 'Strong Melon', 'Abacaloco', 'Framboera', 'Melomorango', 'Hungria', 'Kev', 'MC WM', 'Açaí Cream', 'Blueberry', 'Cherry Cream', 'Beirut', 'Blue Caribbean'] },
    { id: 41, nome: 'ADALYA', codigo: 'ADY0041', preco: 12.50, imagem: 'image/taba/adalya-sabores.webp', categoria: 'Essências', sabores: ['Love 66', 'Mango Tango Ice', 'Swiss Bonbon', 'Hawaii', 'Ice Bonbon', 'Blue Moon', 'Caipirinha Brazil', 'Maracujá', 'Banana Milk'] },
];

// ====================
// 2. ESTADO & CACHE DOM
// ====================
let carrinho = {};
let categoriaAtiva = 'Todos';
let termoBusca = '';
let ordenacaoAtual = 'name-asc';
let viewMode = 'grid';
let totalGlobal = 0;

let cepValido = false;
let cepDados = null;

// ✅ TAXA FIXA DE ENTREGA (ALTERE AQUI SE PRECISAR)
const TAXA_ENTREGA_FIXA = 5.00;

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// Elementos base (serão preenchidos no init)
const el = {};

// ====================
// 3. UTILITÁRIOS
// ====================
function safeGet(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function safeSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

function formatarPreco(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function gerarChave(id, sabor = '') { return `${id}_${sabor || 'padrao'}`; }

function calcularTaxaEntrega(endereco = '', isRetirada = false) {
    if (isRetirada) return { taxa: 0, tipo: 'retirada', desc: 'Retirada na loja' };
    return { taxa: TAXA_ENTREGA_FIXA, tipo: 'fixa', desc: `Taxa fixa: ${formatarPreco(TAXA_ENTREGA_FIXA)}` };
}

function calcularTotalCarrinho() {
    let total = 0, qtd = 0;
    Object.values(carrinho).forEach(i => { total += i.preco * i.quantidade; qtd += i.quantidade; });
    return { total, qtd };
}

// ====================
// 4. RENDERIZAÇÃO
// ====================
function renderizarProdutos(lista = produtos) {
    if (!el.productsGrid) return;
    const frag = document.createDocumentFragment();

    lista.forEach(p => {
        const card = document.createElement('div');
        card.className = `product-card ${viewMode === 'list' ? 'view-list' : ''}`;
        card.dataset.id = p.id;
        const chave = gerarChave(p.id, p.sabores?.[0] || '');
        const qty = carrinho[chave]?.quantidade || 0;

        let html = `
           <div class="product-image"><img src="${p.imagem}" alt="${p.nome}" width="280" height="180" loading="lazy" onerror="this.src='image/cachaca/em-breve.webp'"></div>
            <div class="product-info">
                <div class="product-code">${p.codigo}</div>
                <div class="product-name">${p.nome}</div>
                <div class="product-price">${formatarPreco(p.preco)}</div>`;
        if (p.sabores?.length > 0) {
            html += `<div class="sabor-container"><label class="sabor-label" for="sabor-${p.id}">Sabor:</label>
                     <select class="select-sabor" id="sabor-${p.id}" data-id="${p.id}">
                     ${p.sabores.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>`;
        }
        html += `
                <div class="qty-controls">
                    <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
                    <span class="product-qty" aria-live="polite">${qty}</span>
                    <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
                </div>
            </div>`;
        card.innerHTML = html;
        frag.appendChild(card);
    });

    el.productsGrid.innerHTML = '';
    el.productsGrid.appendChild(frag);
}

// ====================
// 5. CARRINHO
// ====================
function handleQtyChange(btn) {
    const id = parseInt(btn.dataset.id);
    const p = produtos.find(x => x.id === id);
    if (!p) return;
    const sabor = document.querySelector(`.select-sabor[data-id="${id}"]`)?.value || '';
    const chave = gerarChave(id, sabor);

    if (!carrinho[chave]) carrinho[chave] = { ...p, sabor, quantidade: 0 };

    if (btn.dataset.action === 'inc') {
        carrinho[chave].quantidade++;
    } else if (btn.dataset.action === 'dec' && carrinho[chave].quantidade > 0) {
        carrinho[chave].quantidade--;
        if (carrinho[chave].quantidade === 0) delete carrinho[chave];
    }

    safeSet('carrinho_adega_viela_9', carrinho);
    atualizarDisplayCarrinho();
    atualizarBadge(id, chave);
}

function atualizarBadge(id, chave) {
    const badge = document.querySelector(`.product-card[data-id="${id}"] .product-qty`);
    if (badge) badge.textContent = carrinho[chave]?.quantidade || 0;
}

function atualizarDisplayCarrinho() {
    const { total, qtd } = calcularTotalCarrinho();
    totalGlobal = total;

    if (el.cartCount) el.cartCount.textContent = qtd;
    if (el.cartItemsCount) el.cartItemsCount.textContent = `${qtd} ${qtd === 1 ? 'item' : 'itens'}`;
    if (el.cartTotal) el.cartTotal.textContent = formatarPreco(total);
    if (el.footerTotal) el.footerTotal.textContent = formatarPreco(total);

    if (!el.cartItems) return;
    if (qtd === 0) {
        el.cartItems.innerHTML = `<div class="empty-cart"><p>Sua sacola está vazia 🍃</p></div>`;
    } else {
        const frag = document.createDocumentFragment();
        Object.values(carrinho).forEach(i => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.dataset.key = gerarChave(i.id, i.sabor || '');
            const saborHtml = i.sabor ? `<small style="color:#6c757d">• ${i.sabor}</small>` : '';
            div.innerHTML = `
               <div class="cart-item-image"><img src="${i.imagem}" alt="${i.nome}" width="60" height="60" loading="lazy" onerror="this.src='image/cachaca/em-breve.webp'"></div>
                <div class="cart-item-info">
                    <h4>${i.nome}</h4>${saborHtml}
                    <div class="cart-item-code">${i.codigo}</div>
                    <div class="cart-item-total">${formatarPreco(i.preco * i.quantidade)}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" data-action="dec" data-id="${i.id}">−</button>
                    <span class="product-qty">${i.quantidade}</span>
                    <button class="qty-btn" data-action="inc" data-id="${i.id}">+</button>
                </div>`;
            frag.appendChild(div);
        });
        el.cartItems.innerHTML = '';
        el.cartItems.appendChild(frag);
    }

    verificarPedidoMinimo();
}

// ====================
// 6. REGRAS DE NEGÓCIO (ENTREGA / RETIRADA / MÍNIMO)
// ====================
function verificarPedidoMinimo() {
    if (!el.textoInformativo) return;
    const opcao = document.querySelector('input[name="opcaoEnvio"]:checked')?.value;
    const isRetirada = opcao === 'retirada';

    if (opcao === 'entrega' && totalGlobal < 25) {
        const falta = (25 - totalGlobal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        el.textoInformativo.innerHTML = `⚠️ <strong>Pedido mínimo para entrega:</strong> R$ 25,00<br>Faltam apenas <strong>${falta}</strong> para liberar.`;
        el.textoInformativo.style.borderLeftColor = '#ff9800';
    } else if (opcao === 'entrega') {
        el.textoInformativo.innerHTML = `📍 <strong>Entrega:</strong><br>Informe seu endereço no próximo passo.<br><small>Taxa fixa de entrega: ${formatarPreco(TAXA_ENTREGA_FIXA)}.</small>`;
        el.textoInformativo.style.borderLeftColor = '#FF1493';
    } else {
        el.textoInformativo.innerHTML = `🏪 <strong>Retirada na loja:</strong><br>Rua Daniel dos Santos, Viela Nove,  123 - Suzano<br>Aberto das 18h às 02h`;
        el.textoInformativo.style.borderLeftColor = '#28a745';
    }

    // Controla campo endereço
    if (el.enderecoGroup) {
        if (isRetirada) {
            el.enderecoGroup.classList.add('hidden');
            if (el.clienteEndereco) { el.clienteEndereco.disabled = true; el.clienteEndereco.value = ''; }
            if (el.enderecoHelp) el.enderecoHelp.textContent = 'Não necessário para retirada.';
        } else {
            el.enderecoGroup.classList.remove('hidden');
            if (el.clienteEndereco) el.clienteEndereco.disabled = false;
            if (el.enderecoHelp) el.enderecoHelp.textContent = 'Campo obrigatório para entregas.';
        }
    }
    atualizarResumo();
}

function atualizarResumo() {
    if (!el.resumoProdutos || !el.resumoEntrega || !el.resumoTotal) return;
    const opcao = document.querySelector('input[name="opcaoEnvio"]:checked')?.value;
    const isRet = opcao === 'retirada';
    
    const taxa = isRet ? 0 : TAXA_ENTREGA_FIXA;

    el.resumoProdutos.textContent = formatarPreco(totalGlobal);
    el.resumoEntrega.textContent = isRet ? 'Retirada na loja' : formatarPreco(taxa);
    el.resumoTotal.textContent = formatarPreco(totalGlobal + taxa);
}

// ====================
// 7. MODAL & WHATSAPP
// ====================
function abrirModal() {
    if (totalGlobal === 0) return alert('🛒 Adicione produtos antes de finalizar.');
    el.checkoutForm?.reset();
    el.trocoContainer?.classList.add('hidden');
    if (el.valorTroco) el.valorTroco.textContent = '';
    atualizarResumo();
    el.modal?.classList.add('active');
    el.modal?.setAttribute('aria-hidden', 'false');
}

function fecharModal() {
    el.modal?.classList.remove('active');
    el.modal?.setAttribute('aria-hidden', 'true');
}

function enviarWhatsApp() {
    const opcao = document.querySelector('input[name="opcaoEnvio"]:checked')?.value || 'entrega';
    const nome = el.clienteNome?.value.trim();
    const tel = el.clienteTelefone?.value.trim();
    const pag = el.formaPagamento?.value;

    if (!nome || !tel || !pag) return alert('⚠️ Preencha: Nome, Telefone e Forma de Pagamento!');
    
  if (opcao === 'entrega' && totalGlobal < 25) {
    return alert('🚚 Pedido mínimo para entrega é R$ 25,00 em produtos.\nAdicione mais itens ou escolha "Retirada".');
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

   const taxaEntrega = (opcao === 'entrega' && totalGlobal >= 25) 
    ? TAXA_ENTREGA_FIXA 
    : 0;
    const totalFinal = totalGlobal + taxaEntrega;
    
    const formatar = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    let msg = `🛒 *NOVO PEDIDO - ADEGA VIELA 9*\n\n`;
    msg += `👤 *Cliente:* ${nome.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}\n`;
    msg += `📱 *Telefone:* ${tel.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')}\n`;
    
    if (opcao === 'retirada') {
        msg += `🏪 *Retirada na loja*\n📍 Rua Daniel dos Santos, Viela Nove, 763 - Suzano\n`;
    } else {
       const comp = el.clienteComplemento?.value.trim();
const ref = el.clienteReferencia?.value.trim();

if (taxaEntrega > 0) {
    msg += `🚚 *Entrega:* ${formatar(taxaEntrega)}\n`;
} else {
    msg += `🚚 *Entrega:* Grátis\n`;
}
msg += `📍 *Endereço:* ${el.clienteRua.value}, Nº ${el.clienteNumero.value.trim()}`;

if (comp) msg += ` - ${comp}`;

msg += `\n📌 ${el.clienteBairro.value} - ${el.clienteCidade.value}`;

if (ref) msg += `\n🗺️ Ref: ${ref}`;

msg += `\n📮 CEP: ${el.clienteCep.value}\n`;
    }
    
    msg += `\n🍻 *Itens:*\n━━━━━━━━━━━━━━━\n`;
    Object.values(carrinho).forEach(i => {
        msg += `• ${i.nome}${i.sabor ? ` (${i.sabor})` : ''} x${i.quantidade} — ${formatar(i.preco * i.quantidade)}\n`;
    });
    msg += `━━━━━━━━━━━━━━━\n`;
    msg += `💰 *Subtotal:* ${formatar(totalGlobal)}\n`;
    
    if (opcao === 'entrega') {
        msg += `🚚 *Entrega:* ${formatar(taxaEntrega)}\n`;
    }
    
    msg += `🧾 *TOTAL:* *${formatar(totalFinal)}*\n\n`;
    msg += `💳 *Pagamento:* ${pag}\n`;

    if (pag === 'Dinheiro') {
      const trocoVal = parseFloat(el.inputTroco.value.replace(',', '.'));
        const trocoCalc = trocoVal - totalFinal;
        msg += `💵 *Troco para:* ${formatar(trocoVal)}\n`;
        if (trocoCalc >= 0) {
            msg += `💰 *Troco:* ${formatar(trocoCalc)}\n`;
        } else {
            msg += `⚠️ *Valor insuficiente para troco!*\n`;
        }
    }

    const agora = new Date();
    msg += `\n⏰ Pedido: ${String(agora.getHours()).padStart(2,'0')}:${String(agora.getMinutes()).padStart(2,'0')}`;

    carrinho = {};
    safeSet('carrinho_adega_gl', carrinho);
    atualizarDisplayCarrinho();
    renderizarProdutos();
    fecharModal();
    fecharCarrinho();

    window.open(`https://wa.me/5511969702745?text=${encodeURIComponent(msg)}`, '_blank');
}

// ====================
// 8. FILTROS & BUSCA
// ====================
function aplicarFiltros() {
    let lista = [...produtos];
    if (categoriaAtiva && categoriaAtiva !== 'Todos') {
        const map = {
            'Cervejas': ['Cervejas Avulsas', 'Fardos'],
            'Refrigerantes': ['Refrigerantes Lata', 'Refrigerantes 2L'],
            'Tabacaria': ['Essências', 'Combos Essências', 'Carvão', 'Cigarros'],
            'Mercearia': ['Salgadinhos', 'Doces']
        };
        const sub = map[categoriaAtiva];
        lista = sub ? lista.filter(p => sub.includes(p.categoria)) : lista.filter(p => p.categoria === categoriaAtiva);
    }
    if (termoBusca) {
        lista = lista.filter(p => p.nome.toLowerCase().includes(termoBusca) || p.codigo.toLowerCase().includes(termoBusca) || p.categoria.toLowerCase().includes(termoBusca));
    }
    if (ordenacaoAtual) {
        const ops = { 'name-asc': (a,b)=>a.nome.localeCompare(b.nome), 'name-desc': (a,b)=>b.nome.localeCompare(a.nome), 'price-asc': (a,b)=>a.preco-b.preco, 'price-desc': (a,b)=>b.preco-a.preco };
        lista.sort(ops[ordenacaoAtual] || ops['name-asc']);
    }
    renderizarProdutos(lista);
    atualizarContadores();
}

function atualizarContadores() {
    document.querySelectorAll('[data-categoria]').forEach(btn => {
        const cat = btn.dataset.categoria;
        const count = cat === 'Todos' 
            ? produtos.length 
            : produtos.filter(p => p.categoria === cat).length;
        
        let span = btn.querySelector('.count');
        if (!span) {
            span = document.createElement('span');
            span.className = 'count';
            btn.appendChild(span);
        }
        span.textContent = `(${count})`;
    });

    document.querySelectorAll('.count[data-count]').forEach(b => {
        const c = b.dataset.count;
        const count = c === 'Todos' 
            ? produtos.length 
            : produtos.filter(p => p.categoria === c).length;
        b.textContent = `(${count})`;
    });
}

// ====================
// 9. FUNÇÕES DE UI
// ====================
function fecharCarrinho() { 
    el.cartDrawer?.classList.remove('open'); 
    el.overlay?.classList.remove('active'); 
    el.cartDrawer?.setAttribute('aria-hidden','true'); 
}

// Hamburger Menu (Mobile)
function openSidebar() {
    el.sidebar?.classList.add('open');
    el.hamburgerBtn?.classList.add('active');
    el.hamburgerBtn?.setAttribute('aria-expanded', 'true');
    el.sidebarOverlay?.classList.add('active');
    el.sidebarOverlay?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    el.sidebar?.classList.remove('open');
    el.hamburgerBtn?.classList.remove('active');
    el.hamburgerBtn?.setAttribute('aria-expanded', 'false');
    el.sidebarOverlay?.classList.remove('active');
    el.sidebarOverlay?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// ====================
// 10. EVENTOS UNIFICADOS
// ====================
function setupEventListeners() {
    // Click global para dropdowns e categorias
    document.addEventListener('click', (e) => {
        // Dropdown toggle
        const toggle = e.target.closest('.dropdown-toggle');
        if (toggle) {
            e.preventDefault(); e.stopPropagation();
            const dd = toggle.closest('.dropdown');
            $$('.dropdown').forEach(d => d !== dd && d.classList.remove('active'));
            dd?.classList.toggle('active');
            return;
        }
        // Filtro categoria
        const cat = e.target.closest('[data-categoria]');
        if (cat) {
            e.preventDefault(); e.stopPropagation();
            categoriaAtiva = cat.dataset.categoria;
            $$('[data-categoria]').forEach(b => b.closest('li')?.classList.remove('active'));
            cat.closest('li')?.classList.add('active');
            aplicarFiltros();
            if (cat.closest('.dropdown-menu')) $$('.dropdown').forEach(d => d.classList.remove('active'));
            return;
        }
        // Qty buttons
        const qtyBtn = e.target.closest('.qty-btn');
        if (qtyBtn) { e.preventDefault(); handleQtyChange(qtyBtn); return; }
        // Outside click em dropdowns
        if (!e.target.closest('.sidebar')) $$('.dropdown').forEach(d => d.classList.remove('active'));
    });
    // EVENTOS DO CEP
el.btnBuscaCep.addEventListener('click', buscarCep);

el.clienteCep.addEventListener('blur', buscarCep);

el.clienteCep.addEventListener('input', () => {
    if (el.clienteCep.value.length === 9) {
        buscarCep();
    }
});

    // Carrinho
    el.cartBtn?.addEventListener('click', () => { 
        el.cartDrawer?.classList.add('open'); 
        el.overlay?.classList.add('active'); 
        atualizarDisplayCarrinho(); 
    });
    el.closeCart?.addEventListener('click', fecharCarrinho);
    el.overlay?.addEventListener('click', fecharCarrinho);
    el.clearCart?.addEventListener('click', () => { 
        if (confirm('Limpar sacola?')) { 
            carrinho = {}; 
            safeSet('carrinho_adega_gl', carrinho); 
            atualizarDisplayCarrinho(); 
            renderizarProdutos(); 
        } 
    });

    // Modal & Checkout
    el.checkoutBtn?.addEventListener('click', abrirModal);
    el.closeModal?.addEventListener('click', fecharModal);
    el.modal?.addEventListener('click', (e) => { if (e.target === el.modal) fecharModal(); });
    el.enviarWhatsapp?.addEventListener('click', enviarWhatsApp);

    // Forma de pagamento
    el.formaPagamento?.addEventListener('change', function() {
        el.trocoContainer?.classList.toggle('hidden', this.value !== 'Dinheiro');
        if (this.value !== 'Dinheiro') { 
            if (el.inputTroco) el.inputTroco.value = ''; 
            if (el.valorTroco) el.valorTroco.textContent = ''; 
        }
    });

    // Cálculo de troco
    el.inputTroco?.addEventListener('input', () => {
        if (!el.valorTroco) return;
        const val = parseFloat(el.inputTroco.value.replace(',','.'));
        const isRet = document.querySelector('input[name="opcaoEnvio"]:checked')?.value === 'retirada';
        const taxa = isRet ? 0 : TAXA_ENTREGA_FIXA;
        const total = totalGlobal + taxa;
        if (isNaN(val)) return el.valorTroco.textContent = '';
        const troco = val - total;
        el.valorTroco.textContent = troco < 0 ? '❌ Valor insuficiente' : `💰 Troco: ${formatarPreco(troco)}`;
        el.valorTroco.style.color = troco < 0 ? '#dc3545' : '#28a745';
    });

    // Inputs e filtros
    el.clienteEndereco?.addEventListener('input', atualizarResumo);
    el.radioEnvio?.forEach(r => r.addEventListener('change', verificarPedidoMinimo));
    el.searchInput?.addEventListener('input', (e) => { termoBusca = e.target.value.toLowerCase().trim(); aplicarFiltros(); });
    el.sortSelect?.addEventListener('change', (e) => { ordenacaoAtual = e.target.value; aplicarFiltros(); });
    
    // Toggle de visualização (grid/lista)
    el.viewToggle?.addEventListener('click', () => { 
        viewMode = viewMode === 'grid' ? 'list' : 'grid'; 
        el.viewToggle.textContent = viewMode === 'grid' ? '⊞' : '☰'; 
        aplicarFiltros(); 
    });

    // Escape key
    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') { 
            fecharCarrinho(); 
            fecharModal(); 
            closeSidebar();
        } 
    });

    // ========== HAMBURGER MENU EVENTOS ==========
    el.hamburgerBtn?.addEventListener('click', () => {
        if (el.sidebar?.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    el.sidebarOverlay?.addEventListener('click', closeSidebar);

    // Fecha sidebar ao clicar em item do menu (mobile)
    document.querySelectorAll('.sidebar [data-categoria]').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                setTimeout(closeSidebar, 200);
            }
        });
    });
}

// ====================
// 11. INIT
// ====================
function init() {
    // Cache dos elementos DOM
    Object.assign(el, {
        productsGrid: $('#productsGrid'),
        cartBtn: $('#cartBtn'),
        cartDrawer: $('#cartDrawer'),
        overlay: $('#overlay'),
        closeCart: $('#closeCart'),
        cartCount: $('#cartCount'),
        cartItemsCount: $('#cartItemsCount'),
        cartTotal: $('#cartTotal'),
        footerTotal: $('#footerTotal'),
        cartItems: $('#cartItems'),
        clearCart: $('#clearCart'),
        checkoutBtn: $('#checkoutBtn'),
        searchInput: $('#searchInput'),
        sortSelect: $('#sortSelect'),
        viewToggle: $('#viewToggle'),
        modal: $('#checkoutModal'),
        closeModal: $('#closeModal'),
        checkoutForm: $('#checkoutForm'),
        enviarWhatsapp: $('#enviarWhatsapp'),
        clienteNome: $('#clienteNome'),
        clienteTelefone: $('#clienteTelefone'),
        enderecoGroup: $('#enderecoGroup'),
        enderecoHelp: $('#enderecoHelp'),
        formaPagamento: $('#formaPagamento'),
        trocoContainer: $('#trocoContainer'),
        inputTroco: $('#inputTroco'),
        valorTroco: $('#valorTroco'),
        resumoProdutos: $('#resumoProdutos'),
        resumoEntrega: $('#resumoEntrega'),
        resumoTotal: $('#resumoTotal'),
        radioEnvio: $$('input[name="opcaoEnvio"]'),
        infoDestinoContainer: $('#infoDestinoContainer'),
        textoInformativo: $('#textoInformativo'),
        // Elementos do hamburger menu
        sidebar: $('#sidebar'),
        hamburgerBtn: $('#hamburgerBtn'),
        sidebarOverlay: $('#sidebarOverlay'),
        clienteCep: $('#clienteCep'),
        clienteRua: $('#clienteRua'),
        clienteBairro: $('#clienteBairro'),
        clienteCidade: $('#clienteCidade'),
        clienteNumero: $('#clienteNumero'),
        clienteComplemento: $('#clienteComplemento'),
        clienteReferencia: $('#clienteReferencia'),

        btnBuscaCep: $('#btnBuscaCep'),
        cepLoading: $('#cepLoading'),
        cepError: $('#cepError'),
        cepSuccess: $('#cepSuccess'),

        deliveryInfo: $('#deliveryInfo'),
        deliveryInfoIcon: $('#deliveryInfoIcon'),
        deliveryInfoText: $('#deliveryInfoText'),

        enderecoBadge: $('#enderecoBadge'),
        enderecoBadgeIcon: $('#enderecoBadgeIcon'),
        enderecoBadgeText: $('#enderecoBadgeText'),

        numeroError: $('#numeroError'),
        telefoneError: $('#telefoneError'),
        telefoneSuccess: $('#telefoneSuccess'),
        nomeError: $('#nomeError'),
        pagamentoError: $('#pagamentoError')
    });

    

    // Carrega carrinho salvo
    carrinho = safeGet('carrinho_adega_viela_9', {});
    
    // Setup inicial
    atualizarDisplayCarrinho();
    atualizarContadores();
    aplicarFiltros();
    verificarPedidoMinimo();
    
    // Registra todos os eventos
    setupEventListeners();
    
    console.log('🍷 Adega Viela 9 inicializado.');
}

// Inicia quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
// ====================
// BUSCAR CEP (ViaCEP)
// ====================
async function buscarCep() {
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

    } catch {
        el.clienteRua.value = '';
        el.clienteBairro.value = '';
        el.clienteCidade.value = '';
        el.cepError.style.display = 'block';
    } finally {
        el.cepLoading.style.display = 'none';
    }
}