// CPSC 581 Portfolio - Elda Britu - 30158734 - B01

// Theme toggle
const themeToggles = document.querySelectorAll('.theme-toggle');

// Restore saved preference on load
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
}

themeToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('light') ? 'light' : 'dark'
    );
  });
});

// Scroll hide / show
  const nav       = document.querySelector('.tri-nav');
  const mobileBar = document.querySelector('.tri-nav__mobile-bar');
  const THRESHOLD = 60;   // px of scroll before hiding kicks in
  const MOBILE_BP = 767;

  let lastY    = window.scrollY;
  let pendingY = lastY;
  let ticking  = false;

  function update() {
    const y        = pendingY;
    const isMobile = window.innerWidth <= MOBILE_BP;

    if (y > lastY && y > THRESHOLD) {
      if (isMobile) {
        mobileBar.classList.add('bar--hidden');
      } else {
        nav.classList.add('nav--hidden');
      }
    } else if (y < lastY || y <= THRESHOLD) {
      nav.classList.remove('nav--hidden');
      mobileBar.classList.remove('bar--hidden');
    }

    lastY   = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    pendingY = window.scrollY;   // grab position immediately at event time
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
})();
