const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const backdrop = document.querySelector('.backdrop');

function backdropClickHandler() {
    backdrop.style.display = 'none';
    sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
    backdrop.style.display = 'block';
    sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);