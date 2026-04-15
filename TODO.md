# 📋 TODO: Melhorias - Adega da Viela 9
> **Projeto:** Adega da Viela 9 | **Última Atualização:** 2026-04-09  
> **Status:** 🟡 Em desenvolvimento | **Próximo Deploy:** A definir

---

## 🔴 CRÍTICO (Resolver antes de escalar / Risco financeiro ou perda de pedidos)
- [ ] **Verificar limite de URL do WhatsApp**  
  *Implementar `if (url.length > 2000) { alert(...); return; }` antes de `window.open()` para evitar corte silencioso da mensagem.*
- [ ] **Sincronizar preços do carrinho com catálogo**  
  *Alterar `calcularTotalCarrinho()` para buscar o preço atual em `produtos.find()` (evita erro financeiro se preços forem atualizados no código).*
- [ ] **Corrigir seletor `inputTroco` inconsistente**  
  *Padronizar nome para `trocoInput: $('#troco')` no `init()` e atualizar todas as referências no JS.*
- [ ] **Unificar regra CSS `.sidebar` duplicada**  
  *Remover a primeira declaração (~linha 85) e manter apenas a versão com `flex-direction: column`. Mover `overflow-y: auto` para `.categories`.*
- [ ] **Máscara e validação robusta de telefone**  
  *Implementar máscara em tempo real `(XX) XXXXX-XXXX` no `input` e atualizar `pattern` do HTML para `^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$`.*

---

## 🟡 ALTA PRIORIDADE (Esta semana / Impacto direto em UX e Acessibilidade)
- [ ] **Centralizar configurações em `CONFIG`**  
  *Criar objeto no topo do JS com `PEDIDO_MINIMO_ENTREGA`, `TAXA_ENTREGA_FIXA`, `WHATSAPP_NUMERO`, `CARRINHO_STORAGE_KEY`.*
- [ ] **Adicionar debounce na busca**  
  *Criar utilitário `debounce(func, 300)` e aplicar no `searchInput` para evitar re-renderizações excessivas.*
- [ ] **Gerenciamento de foco em modais (Focus Trap)**  
  *Salvar `document.activeElement` ao abrir modal, focar no primeiro campo, prender `Tab` dentro do modal e restaurar foco ao fechar.*
- [ ] **Respeitar `prefers-reduced-motion`**  
  *Adicionar media query no CSS para zerar `animation-duration` e `transition-duration` para usuários com sensibilidade a movimento.*
- [ ] **Aumentar touch targets para mobile**  
  *Garantir mínimo `44x44px` em `.qty-btn`, `.close-btn`, `.view-toggle-btn` e itens do menu (recomendação Apple/Google).*
- [ ] **Otimizar transições CSS**  
  *Substituir `transition: all` por `transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease`.*
- [ ] **Modal de verificação de idade (18+)**  
  *Criar overlay obrigatório ao primeiro acesso com opções "Sou maior de idade" / "Sou menor". Salvar resposta em `sessionStorage`.*

---

## 🟢 MÉDIA/BAIXA (Otimização, Segurança e Evolução)
- [ ] **Otimizar assets de imagem**  
  *Comprimir todas as imagens (WebP/JPG) via TinyPNG ou Squoosh. Reduzir resolução da logo para ~300x300px.*
- [ ] **Adicionar Skip Link de acessibilidade**  
  *Inserir `<a href="#main-content" class="skip-link">Pular para conteúdo</a>` no início do `<body>` com CSS de foco visível.*
- [ ] **Conformidade LGPD**  
  *Criar páginas `/privacidade.html` e `/termos.html`. Adicionar link no rodapé da sidebar.*
- [ ] **Refatorar Global Click Listener**  
  *Separar `document.addEventListener('click')` gigante em listeners específicos por componente (dropdowns, categorias, botões qty).*
- [ ] **Tratamento de erros (Try/Catch)**  
  *Envolver `window.open(WhatsApp)`, `localStorage` e futuras chamadas de API em blocos `try/catch` com fallback visual.*
- [ ] **Prevenção XSS em renderização dinâmica**  
  *Substituir interpolação direta `${p.nome}` em `innerHTML` por `textContent` ou função `escapeHtml()`.*
- [ ] **Implementar PWA básico**  
  *Criar `manifest.json` (nome, ícones, theme-color) e registrar Service Worker para cache offline e instalação no celular.*

---

## 📊 CHECKLIST DE QUALIDADE PRÉ-DEPLOY
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Fluxo completo testado: Adicionar → Carrinho → Checkout → WhatsApp
- [ ] Navegação 100% funcional por teclado (Tab, Enter, Escape)
- [ ] Teste cruzado: Chrome Android, Safari iOS, Firefox Desktop
- [ ] Backup Git tag `v1.0-pre-launch` criado
- [ ] Analytics/Conversion tracking configurado (opcional)

---

## 📝 NOTAS & DECISÕES TÉCNICAS
- ✅ **Imagens otimizadas**: `width/height` e `loading` aplicados em logo, grid de produtos e carrinho.
- ⚠️ **WhatsApp API**: Limite de ~2000 caracteres na URL. Considerar backend ou API Business se pedidos crescerem.
- 🔄 **Catálogo**: Atualmente hardcoded em `produtos[]`. Migrar para JSON externo ou Firebase quando >50 produtos.
- 📱 **Mobile First**: Breakpoints principais: `900px` (tablet/mobile), `600px` (mobile), `480px` (mobile pequeno).

> 💡 **Dica**: Marque as tarefas concluídas com `- [x]`. Use branches Git separadas para `feature/whatsapp-fix`, `feat/accessibility`, etc.
>
> # ✅ DONE: Otimizações Implementadas - Adega da Viela 9
> **Data:** 2026-04-09 | **Escopo:** HTML, JS (Renderização), SEO & Performance  
> **Status:** 🟢 Concluído | **Backup Git:** `feat: otimizacoes-imagens-e-analise-base`

---

## 🟢 IMPLEMENTADO (Confirmado pelo Desenvolvedor)

### 🖼️ Otimização de Imagens & Core Web Vitals
- [x] **Logo (`index.html`)**  
  ✅ Adicionados `width="1024" height="1024"` e `loading="eager"`  
  ✅ Corrigido atributo `alt` (remoção de espaço inicial)  
   *Efeito:* Espaço reservado antes do carregamento, prioridade na renderização acima da dobra.

- [x] **Grid de Produtos (`js/script.js` → `renderizarProdutos`)**  
  ✅ Linha de imagem atualizada para:  
  `<img src="${p.imagem}" alt="${p.nome}" width="280" height="180" loading="lazy" onerror="...">`  
  🎯 *Efeito:* Lazy loading aplicado a ~41 produtos, redução de tráfego inicial, CLS estável.

- [x] **Carrinho Lateral (`js/script.js` → `atualizarDisplayCarrinho`)**  
  ✅ Linha de imagem atualizada para:  
  `<img src="${i.imagem}" alt="${i.nome}" width="60" height="60" loading="lazy" onerror="...">`  
  🎯 *Efeito:* Itens do carrinho sem pulso visual ao abrir drawer.

### 📊 Análise & Documentação
- [x] **Auditoria Completa do Código-Fonte**  
  ✅ HTML: Semântica, meta tags, Open Graph, Twitter Card, ARIA, estrutura de formulário validada  
  ✅ CSS: Variáveis, breakpoints, animações, duplicações mapeadas, media queries revisadas  
  ✅ JS: Lógica de carrinho, persistência `localStorage`, event delegation, fluxo WhatsApp, bugs críticos catalogados

- [x] **Planejamento Técnico**  
  ✅ Criação do `TODO.md` com checklist priorizado (Crítico → Alta → Média)  
  ✅ Definição de metas de qualidade (Lighthouse ≥ 90, Accessibility ≥ 95, CLS ≈ 0)  
  ✅ Registro de decisões técnicas (limites WhatsApp, estrutura de catálogo, responsividade)

---

## 📈 IMPACTO ESPERADO (Pós-Implementação)

| Métrica | Antes | Depois (Estimado) | Status |
|---------|-------|-------------------|--------|
| **CLS (Layout Shift)** | ⚠️ Variável / Pulos visuais | ✅ 0.00 - 0.05 | 🟢 Estável |
| **LCP (Carregamento)** | 🐢 Imagens bloqueiam render | 🚀 Carregamento seletivo | 🟡 Em melhoria |
| **SEO Base** | ✅ Bom | ✅ Otimizado para Core Web Vitals | 🟢 Pronto |
| **Manutenibilidade** | 📄 Código solto | 📚 Documentado + TODO ativo | 🟢 Rastreável |

---

## 🔄 PRÓXIMAS ENTREGAS (Em Fila no `TODO.md`)
1. Implementação do objeto `CONFIG` no JS
2. Máscara de telefone em tempo real + validação robusta
3. Foco trap em modais (Acessibilidade WCAG 2.1)
4. Modal de verificação de idade (18+) + conformidade LGPD

---

> 💡 **Como manter atualizado:**  
> 1. Ao concluir uma tarefa do `TODO.md`, recorte a linha e cole aqui com `[x]`  
> 2. Adicione uma breve nota técnica se houver mudança de comportamento  
> 3. Faça commit: `git add TODO.md DONE.md && git commit -m "docs: atualiza progresso e registros"`  
> 4. Mantenha ambos os arquivos na raiz do repositório para rastreabilidade

**🎉 Parabéns!** Você já eliminou os principais vilões de performance (CLS) e estruturou o projeto para evolução segura. O próximo passo é aplicar as correções de lógica (WhatsApp, preços, telefone) para fechar o ciclo de produção. 🚀