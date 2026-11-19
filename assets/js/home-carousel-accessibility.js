(() => {
  const carousel = document.querySelector('#carousel-1');
  if (!carousel) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.bootstrap?.Carousel.getOrCreateInstance(carousel, {
    interval: 5000,
    ride: reducedMotion ? false : 'carousel',
  });
})();
