(() => {
  'use strict';

  const cards = document.querySelectorAll(
    '#home-research .rise-card, #home-publications .pub-entry, #home-news .news-card, #home-people .home-community-grid'
  );

  function createLink(action, className, label) {
    const link = document.createElement('a');
    link.className = className;
    for (const name of ['href', 'target', 'rel', 'download', 'referrerpolicy']) {
      const value = action.getAttribute(name);
      if (value !== null) link.setAttribute(name, value);
    }
    link.setAttribute('aria-label', label);
    return link;
  }

  for (const card of cards) {
    const action = card.querySelector('[data-home-image-action][href]') || card.querySelector('a.rise-link[href]');
    if (!action) continue;

    const actionText = action.lastChild;
    if (card.matches('#home-publications .pub-entry') && actionText?.nodeType === Node.TEXT_NODE) {
      actionText.nodeValue = actionText.nodeValue.replace(/\u2197[\uFE0E\uFE0F]?\s*$/, '\u2192');
    }

    const photo = card.querySelector('img');
    if (!photo) continue;

    const heading = card.querySelector('h3');
    if (!photo.closest('a')) {
      const label = action.getAttribute('aria-label') || heading?.textContent.trim()
        || action.textContent.trim().replace(/\s*\u2192$/, '');
      const imageLink = createLink(action, 'home-image-link', label);
      photo.before(imageLink);
      imageLink.append(photo);
    }

    const caption = card.querySelector('.home-community-caption');
    const title = heading || caption;
    if (!title || title.closest('a')) continue;

    const text = caption ? [caption] : [...heading.parentElement.querySelectorAll(':scope > :is(h3, p)')];
    if (text.some(part => part.querySelector('a, button, input, select, textarea, [tabindex]'))) continue;

    const textLink = createLink(action, 'home-card-text-link', title.textContent.trim());
    text[0].before(textLink);
    textLink.append(...text);
  }
})();
