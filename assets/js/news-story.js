(() => {
  const images = Array.from(document.querySelectorAll('.news-detail #story .story-media-frame > img'));
  if (!images.length) return;

  function arrangeMedia(media) {
    const figures = Array.from(media.children);
    if (figures.length < 2 || figures.some(figure => !figure.matches('.story-figure'))) return;
    const items = figures.map(figure => {
      const img = figure.querySelector('.story-image');
      const kind = figure.classList.contains('story-figure-academic') ? 'academic'
        : figure.classList.contains('story-figure-document') ? 'document' : 'photo';
      return {
        figure, kind,
        width: Number(img?.getAttribute('width')) || img?.naturalWidth || 0,
        height: Number(img?.getAttribute('height')) || img?.naturalHeight || 0,
      };
    });
    const rows = document.createDocumentFragment();
    for (let index = 0; index < items.length; index += 1) {
      const first = items[index];
      const next = items[index + 1];
      const firstRatio = first.height ? first.width / first.height : 0;
      const nextRatio = next?.height ? next.width / next.height : 0;
      const row = document.createElement('div');
      row.className = 'story-media-row';
      row.append(first.figure);
      if (next && first.kind === next.kind && first.kind !== 'academic' &&
          firstRatio >= .55 && firstRatio <= 2 &&
          nextRatio >= .55 && nextRatio <= 2 &&
          Math.max(firstRatio, nextRatio) <= 2.25 * Math.min(firstRatio, nextRatio)) {
        const maxHeight = Math.min(first.height, next.height, 390);
        row.classList.add('story-media-row-paired');
        row.style.setProperty('--story-first-column', firstRatio + 'fr');
        row.style.setProperty('--story-second-column', nextRatio + 'fr');
        row.style.setProperty('--story-pair-width', Math.floor(maxHeight * (firstRatio + nextRatio)) + 'px');
        row.append(next.figure);
        index += 1;
      }
      rows.append(row);
    }
    media.append(rows);
    media.classList.add('story-media-arranged');
  }

  for (const media of document.querySelectorAll('.news-detail #story .story-media')) {
    const galleryImages = Array.from(media.querySelectorAll('.story-image'));
    const pending = galleryImages.filter(img => !img.complete && !(img.width && img.height)).map(img => new Promise(resolve => {
      img.addEventListener('load', resolve, {once: true});
      img.addEventListener('error', resolve, {once: true});
    }));
    Promise.all(pending).then(() => arrangeMedia(media));
  }

  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'story-photo-dialog';
  dialog.setAttribute('aria-label', 'Article image');
  const form = document.createElement('form');
  form.method = 'dialog';
  const original = document.createElement('a');
  original.className = 'story-photo-original rise-arrow-link';
  original.target = '_blank';
  original.rel = 'noopener noreferrer';
  const originalLabel = document.createElement('span');
  originalLabel.className = 'rise-link-label';
  originalLabel.textContent = 'Open original';
  const originalArrow = document.createElement('span');
  originalArrow.className = 'rise-link-arrow';
  originalArrow.dataset.direction = 'right';
  originalArrow.setAttribute('aria-hidden', 'true');
  original.append(originalLabel, originalArrow);
  original.setAttribute('aria-label', 'Open original image in a new tab');
  const close = document.createElement('button');
  close.className = 'story-photo-close';
  close.textContent = 'Close';
  close.autofocus = true;
  form.append(original, close);
  const image = document.createElement('img');
  image.alt = '';
  dialog.append(form, image);
  document.body.append(dialog);
  let trigger;
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    original.removeAttribute('href');
    trigger?.focus();
    trigger = undefined;
  });

  for (const img of images) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'story-photo-button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', img.alt ? 'View larger image: ' + img.alt : 'View larger image');
    img.before(button);
    button.append(img);
    button.addEventListener('click', () => {
      const source = img.currentSrc || img.src;
      trigger = button;
      image.alt = img.alt;
      image.src = source;
      original.href = img.dataset.originalSrc || source;
      dialog.showModal();
    });
  }
})();
