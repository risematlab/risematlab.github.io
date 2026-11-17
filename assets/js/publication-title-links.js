(() => {
  'use strict';

  for (const entry of document.querySelectorAll('#publication-list .pub-entry')) {
    const heading = entry.querySelector(':scope > h3');
    const sourceLink = entry.querySelector(':scope > a.rise-link[href]');
    if (!heading || !sourceLink || heading.querySelector('a')) continue;

    const titleLink = document.createElement('a');
    titleLink.className = 'publication-title-link';
    for (const name of ['href', 'target', 'rel', 'download', 'referrerpolicy']) {
      const value = sourceLink.getAttribute(name);
      if (value !== null) titleLink.setAttribute(name, value);
    }

    titleLink.append(...heading.childNodes);
    heading.append(titleLink);
  }
})();
