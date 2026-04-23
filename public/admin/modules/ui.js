export function initTabs() {
    const menuItems = document.querySelectorAll('.menu-item');
    const secoes = document.querySelectorAll('.secao-painel');

    menuItems.forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            const alvoId = item.getAttribute('data-target');
            const secaoAlvo = document.getElementById(alvoId);

            if (!secaoAlvo) return; // Segurança caso o ID no HTML esteja errado

            // 1. Reseta o estilo de todos os botões do menu
            menuItems.forEach(m => {
                m.classList.remove('bg-viela-magenta', 'text-white', 'font-bold');
                m.classList.add('text-gray-400');
            });

            // 2. Aplica o destaque (Estilo Viela 9) no item clicado
            item.classList.add('bg-viela-magenta', 'text-white', 'font-bold');
            item.classList.remove('text-gray-400');

            // 3. Esconde todas as seções e mostra apenas a selecionada
            secoes.forEach(s => s.classList.add('hidden'));
            secaoAlvo.classList.remove('hidden');
        };
    });
}