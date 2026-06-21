let _revealObserver = null;

export function initReveal() {
  if (_revealObserver) {
    _revealObserver.disconnect();
  }
  _revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        _revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => {
    _revealObserver.observe(el);
  });
}
