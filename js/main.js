/*Початок js логіки для header*/

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

/*Кінець js логіки для header*/

/*Початок js логіки для threat cards*/
const threatValues = document.querySelectorAll('.threat__card-value');

function animateValue(element, target, duration = 1400) {
	const start = 0;
	const startTime = performance.now();

	function update(currentTime) {
		const elapsedTime = currentTime - startTime;
		const progress = Math.min(elapsedTime / duration, 1);

		const easedProgress = 1 - Math.pow(1 - progress, 3);
		const currentValue = Math.round(start + (target - start) * easedProgress);
		element.textContent = `${currentValue}%`;

		if (progress < 1) {
			requestAnimationFrame(update);
		} else {
			element.textContent = `${target}%`;
		}
	}

	requestAnimationFrame(update);
}

function initThreatAnimation() {
	if (!threatValues.length) return;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const observer = new IntersectionObserver(
		(entries, observerInstance) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;

				const valueElement = entry.target;
				const targetValue = Number(valueElement.dataset.target);

				if (!Number.isFinite(targetValue)) return;

				if (prefersReducedMotion) {
					valueElement.textContent = `${targetValue}%`;
				} else {
					valueElement.textContent = '0%';
					animateValue(valueElement, targetValue);
				}

				observerInstance.unobserve(valueElement);
			});
		},
		{
			threshold: 0.4,
		}
	);

	threatValues.forEach((valueElement) => {
		observer.observe(valueElement);
	});
}

initThreatAnimation();
/*Кінець js логіки для threat cards*/