document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.secondary');
    const main = document.querySelector('.main');

    hamburger.addEventListener('click', function(event) {
        console.log('clicked');
        event.stopPropagation();
        this.classList.toggle('active');
        sidebar.classList.toggle('active');
        main.classList.toggle('menu-active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = sidebar.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInside && sidebar.classList.contains('active')) {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
            main.classList.remove('menu-active');
            document.body.classList.remove('menu-open');
        }
    });

    // Prevent clicks inside the sidebar from closing it
    sidebar.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
