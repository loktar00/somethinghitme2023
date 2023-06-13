
(() => {
    // Get stored theme from local storage, if available. Otherwise, get the system preferred theme.
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    // Apply the theme
    document.documentElement.setAttribute('data-theme', theme);
    
    const toggle = document.querySelector('.toggle');
    if (theme === 'light') {
        toggle.checked = true;
    }

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    });
})();
