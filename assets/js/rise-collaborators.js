(() => {
  'use strict';

  const list = document.querySelector('.rise-sponsor-footer .rc-grid');
  if (!list) return;

  const copy = list.cloneNode(true);
  copy.classList.add('rc-copy');
  copy.setAttribute('aria-hidden', 'true');

  const track = document.createElement('div');
  track.className = 'rc-track';

  const viewport = document.createElement('div');
  viewport.className = 'rc-viewport';

  list.replaceWith(viewport);
  track.append(list, copy);
  viewport.append(track);
})();
