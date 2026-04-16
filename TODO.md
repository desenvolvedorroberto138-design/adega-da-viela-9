# TODO: Fixar Contadores, Carrinho e Imagens no Adega da Viela 9

Status: ✅ Plano aprovado pelo usuário

## Passos:

1. ✅ Criar este TODO.md
2. ☐ Editar public/js/data.js: Corrigir TODOS os caminhos de imagem 'image/' → 'assets/images/' (41 produtos)
3. ☐ Editar public/js/render.js: Corrigir fallback no onerror das imagens
4. ☐ Editar public/js/cart.js: Adicionar método handleQuantityChange() para botões +/- funcionar no carrinho/produtos
5. ☐ Atualizar TODO.md marcando 2-4 como ✅
6. ☐ Testar: Executar servidor local e verificar contadores aparecem, imagens carregam, carrinho adiciona itens e abre
7. ☐ Finalizar task com attempt_completion

## Detalhes das correções:
- Imagens: paths errados em data.js causam 404s
- Carrinho: falta handler para clicks nos botões qty
- Contadores: dependem de produtos carregados corretamente (funcionará após paths)

Próximo passo: 2
