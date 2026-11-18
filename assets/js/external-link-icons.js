(() => {
  'use strict';

  const leading = /^\s*([\u2190\u2192\u2197])[\uFE0E\uFE0F]?\s*/u;
  const trailing = /\s*([\u2190\u2192\u2197])[\uFE0E\uFE0F]?\s*$/u;
  const markerOnly = /^[\u2190\u2192\u2197][\uFE0E\uFE0F]?$/u;
  const siteHosts = new Set(['risematlab.com', 'www.risematlab.com', location.hostname]);

  function edgeText(link, atStart) {
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    let last;
    while (walker.nextNode()) {
      if (!walker.currentNode.data.trim()) continue;
      if (atStart) return walker.currentNode;
      last = walker.currentNode;
    }
    return last;
  }

  function removeMarker(link, atStart) {
    const boundary = edgeText(link, atStart);
    if (!boundary) return;

    const oldSpan = boundary.parentElement;
    boundary.data = boundary.data.replace(atStart ? leading : trailing, '');
    if (oldSpan !== link && oldSpan.matches('span[aria-hidden="true"]') &&
        !oldSpan.childElementCount && !oldSpan.textContent.trim()) {
      oldSpan.remove();
    }
  }

  function decorateLink(link) {
    if (link.classList.contains('rise-arrow-link')) return;

    const icon = link.querySelector(':scope > .rise-link-arrow');
    const text = link.textContent.trim();
    const atStart = leading.test(text);
    if (!icon && (markerOnly.test(text) || (!atStart && !trailing.test(text)))) return;

    if (icon) icon.remove();
    else removeMarker(link, atStart);

    const boundary = edgeText(link, atStart);
    if (boundary) boundary.data = atStart ? boundary.data.trimStart() : boundary.data.trimEnd();
    if (link.protocol === 'mailto:') return;

    const label = document.createElement('span');
    label.className = 'rise-link-label';
    label.append(...link.childNodes);

    const arrow = document.createElement('span');
    arrow.className = 'rise-link-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    const external = /^https?:$/.test(link.protocol) && !siteHosts.has(link.hostname);
    arrow.dataset.direction = atStart ? 'left' : external ? 'diagonal' : 'right';

    if (link.matches('.person-profile-link, .pi-links a[href*="linkedin.com/in/"]')) {
      link.classList.add('rise-profile-action');
    }
    link.classList.add('rise-arrow-link');

    // Keep an inline arrow next to the word without adding a third flex item.
    if (atStart) {
      label.prepend('\u2060');
      link.append(arrow, label);
    } else {
      label.append('\u2060');
      link.append(label, arrow);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    for (const link of document.querySelectorAll('.rise-site a[href]')) decorateLink(link);
  }, { once: true });
})();
