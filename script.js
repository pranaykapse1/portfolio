const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
    menuButton.querySelector('span').textContent = isOpen ? '+' : '−';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      menuButton.querySelector('span').textContent = '+';
    });
  });
}

const revealItems = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
const cadfuelCarousel = document.querySelector('[data-carousel]');
if (cadfuelCarousel) {
  const slides = [...cadfuelCarousel.querySelectorAll('.cadfuel-slide')];
  const count = cadfuelCarousel.querySelector('.cadfuel-slide-count');
  const dotNav = cadfuelCarousel.querySelector('.cadfuel-carousel-dots');
  const previous = cadfuelCarousel.querySelector('[data-carousel-prev]');
  const next = cadfuelCarousel.querySelector('[data-carousel-next]');
  const toggle = cadfuelCarousel.querySelector('[data-carousel-toggle]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeSlide = 0;
  let isPaused = reducedMotion;
  let timer;

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show screenshot ${index + 1}`);
    dot.setAttribute('aria-current', String(index === activeSlide));
    dot.addEventListener('click', () => showSlide(index));
    dotNav.append(dot);
  });
  const dots = [...dotNav.querySelectorAll('button')];

  function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      slide.hidden = position !== activeSlide;
      dots[position].setAttribute('aria-current', String(position === activeSlide));
    });
    count.innerHTML = `${String(activeSlide + 1).padStart(2, '0')} <i>/</i> ${String(slides.length).padStart(2, '0')}`;
  }

  function updateToggle() {
    toggle.textContent = isPaused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', isPaused ? 'Play slideshow' : 'Pause slideshow');
    toggle.title = isPaused ? 'Play slideshow' : 'Pause slideshow';
  }
  function stopRotation() {
    window.clearInterval(timer);
    timer = undefined;
  }
  function isKeyboardFocused() {
    return [...cadfuelCarousel.querySelectorAll('a, button')].some((control) => control.matches(':focus-visible'));
  }
  function startRotation(force = false) {
    stopRotation();
    if (!isPaused && !document.hidden && (force || !isKeyboardFocused())) {
      timer = window.setInterval(() => showSlide(activeSlide + 1), 3000);
    }
  }

  previous.addEventListener('click', () => { showSlide(activeSlide - 1); startRotation(); });
  next.addEventListener('click', () => { showSlide(activeSlide + 1); startRotation(); });
  toggle.addEventListener('click', () => {
    isPaused = !isPaused;
    updateToggle();
    startRotation(!isPaused);
  });
  cadfuelCarousel.addEventListener('focusin', (event) => {
    if (event.target.matches(':focus-visible')) stopRotation();
  });
  cadfuelCarousel.addEventListener('focusout', (event) => {
    if (!cadfuelCarousel.contains(event.relatedTarget)) startRotation();
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stopRotation() : startRotation());
  showSlide(0);
  updateToggle();
  startRotation();
}
