(() => {
  const section = document.querySelector('#gallery');
  const track = section?.querySelector('#lab-life-photos');
  const controls = section?.querySelector('.people-gallery-controls');
  if (!track || !controls || track.children.length < 2) return;

  const figures = [...track.querySelectorAll('figure')];
  const status = controls.querySelector('.people-gallery-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let settleTimer;

  function offset(index) {
    return figures[index].getBoundingClientRect().left - figures[0].getBoundingClientRect().left;
  }

  function visiblePhotos() {
    return Math.max(1, Math.min(figures.length, Math.round(track.clientWidth / offset(1))));
  }

  function announce() {
    const visible = visiblePhotos();
    const first = current + 1;
    const last = Math.min(figures.length, current + visible);
    const range = visible === 1 ? String(first) : first + '–' + last;
    const label = (visible === 1 ? 'Photo ' : 'Photos ') + range + ' of ' + figures.length;
    if (status.textContent !== label) status.textContent = label;
  }

  function move(direction) {
    const end = figures.length - visiblePhotos();
    const adjacent = current + direction;
    const wraps = adjacent < 0 || adjacent > end;
    current = adjacent < 0 ? end : adjacent > end ? 0 : adjacent;
    track.scrollTo({left: offset(current), behavior: motion.matches || wraps ? 'auto' : 'smooth'});
    announce();
  }

  function syncWithScroll() {
    const end = figures.length - visiblePhotos();
    current = figures.slice(0, end + 1).reduce((closest, _, index) =>
      Math.abs(offset(index) - track.scrollLeft) < Math.abs(offset(closest) - track.scrollLeft) ? index : closest, 0);
    announce();
  }

  track.classList.add('is-carousel');
  track.tabIndex = 0;
  controls.hidden = false;
  announce();

  for (const button of controls.querySelectorAll('[data-gallery-step]')) {
    button.addEventListener('click', () => move(Number(button.dataset.galleryStep)));
  }

  track.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });

  track.addEventListener('scroll', () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(syncWithScroll, 160);
  }, {passive: true});

  window.addEventListener('resize', () => {
    current = Math.min(current, figures.length - visiblePhotos());
    track.scrollTo({left: offset(current), behavior: 'auto'});
    announce();
  });
})();
