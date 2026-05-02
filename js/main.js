const burger = document.querySelector('.header__burger');
const mobileMenu = document.querySelector('.header__mobile-menu');
const closeButton = document.querySelector('.header__menu-close');

burger.addEventListener('click', () => {
	mobileMenu.classList.add('is-open');
	burger.setAttribute('aria-expanded', 'true');
});

closeButton.addEventListener('click', () => {
	mobileMenu.classList.remove('is-open');
	burger.setAttribute('aria-expanded', 'false');
});