const siteHeader = document.querySelector('.site-header');
const burger = document.querySelector('.site-header__burger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeButton = document.querySelector('.mobile-menu__close');
const mobileLinks = document.querySelectorAll('.mobile-menu__link');

function openMenu() {
	mobileMenu.classList.add('is-open');
	document.body.classList.add('menu-open');
	burger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
	mobileMenu.classList.remove('is-open');
	document.body.classList.remove('menu-open');
	burger.setAttribute('aria-expanded', 'false');
}

function toggleHeaderBackground() {
	if (window.scrollY > 10) {
		siteHeader.classList.add('site-header--scrolled');
	} else {
		siteHeader.classList.remove('site-header--scrolled');
	}
}

burger.addEventListener('click', openMenu);
closeButton.addEventListener('click', closeMenu);

mobileLinks.forEach((link) => {
	link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
		closeMenu();
	}
});

window.addEventListener('scroll', toggleHeaderBackground);
toggleHeaderBackground();