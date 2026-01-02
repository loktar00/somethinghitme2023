
(() => {
    const triggerBtn = document.getElementById('theme-trigger');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-mode');
    }

    function updateThemeUI() {
        triggerBtn.setAttribute('aria-label', body.classList.contains('dark-mode') ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }

    triggerBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const newTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);

        updateThemeUI();
    });
})();
