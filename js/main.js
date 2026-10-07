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

/*Початок js логіки для accordion*/
const accordions = document.querySelectorAll('.accordion');

const prefersReducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)'
);

function setAccordionItemState(item, trigger, panel, isOpen) {
	item.classList.toggle('accordion__item--open', isOpen);
	trigger.setAttribute('aria-expanded', String(isOpen));
	panel.hidden = !isOpen;

	// При стартовій ініціалізації не задаємо height вручну,
	// щоб відкриті блоки мали природну висоту.
	panel.style.height = '';
	panel.style.overflow = '';
}

function openAccordionItem(item, trigger, panel) {
	item.classList.add('accordion__item--open');
	trigger.setAttribute('aria-expanded', 'true');

	if (prefersReducedMotion.matches) {
		panel.hidden = false;
		return;
	}

	// Спочатку робимо панель видимою, інакше scrollHeight буде недоступний.
	panel.hidden = false;

	// Старт анімації: висота 0.
	panel.style.overflow = 'hidden';
	panel.style.height = '0px';

	// Примусовий reflow: браузер має зафіксувати height: 0px
	// перед переходом до реальної висоти.
	panel.offsetHeight;

	// scrollHeight — реальна висота всього контенту всередині панелі.
	panel.style.height = `${panel.scrollHeight}px`;

	panel.addEventListener(
		'transitionend',
		(event) => {
			if (event.propertyName !== 'height') return;

			// Після відкриття повертаємо auto,
			// щоб контент міг нормально адаптуватися при зміні ширини екрана.
			panel.style.height = 'auto';
			panel.style.overflow = '';
		},
		{ once: true }
	);
}

function closeAccordionItem(item, trigger, panel) {
	item.classList.remove('accordion__item--open');
	trigger.setAttribute('aria-expanded', 'false');

	if (prefersReducedMotion.matches) {
		panel.hidden = true;
		return;
	}

	// Перед закриттям фіксуємо поточну реальну висоту панелі.
	panel.style.overflow = 'hidden';
	panel.style.height = `${panel.scrollHeight}px`;

	// Примусовий reflow, щоб браузер побачив стартову висоту.
	panel.offsetHeight;

	// Анімуємо до нуля.
	panel.style.height = '0px';

	panel.addEventListener(
		'transitionend',
		(event) => {
			if (event.propertyName !== 'height') return;

			// Після завершення анімації реально ховаємо панель.
			panel.hidden = true;
			panel.style.height = '';
			panel.style.overflow = '';
		},
		{ once: true }
	);
}

function initAccordion(accordion) {
	const items = accordion.querySelectorAll('.accordion__item');

	items.forEach((item, index) => {
		const trigger = item.querySelector('.accordion__trigger');

		if (!trigger) return;

		const panelId = trigger.getAttribute('aria-controls');
		const panel = document.getElementById(panelId);

		if (!panel) return;

		// Якщо в HTML уже вказано відкритий стан — поважаємо його.
		// Якщо відкритий стан ніде не вказаний, перший пункт робимо відкритим.
		const isOpen =
			item.classList.contains('accordion__item--open') ||
			(index === 0 && !accordion.querySelector('.accordion__item--open'));

		setAccordionItemState(item, trigger, panel, isOpen);

		trigger.addEventListener('click', () => {
			const isCurrentlyOpen =
				trigger.getAttribute('aria-expanded') === 'true';

			if (isCurrentlyOpen) {
				closeAccordionItem(item, trigger, panel);
			} else {
				openAccordionItem(item, trigger, panel);
			}
		});
	});
}

accordions.forEach((accordion) => {
	initAccordion(accordion);
});
/*Кінець js логіки для accordion*/