(() => {
  'use strict';

  function formatCitation(entry) {
    const copy = entry.querySelector(':scope > .citation-copy');
    if (!copy || copy.childElementCount) return;

    const text = copy.textContent.trim();
    const openingQuote = text.indexOf('“');
    const prefix = openingQuote < 0 ? text : text.slice(0, openingQuote);
    const date = /\s+\(((?:19|20)\d{2})\)/u.exec(prefix);
    if (!date && openingQuote < 0) return;

    const workStart = date ? date.index + date[0].length : openingQuote;
    const work = text.slice(workStart).replace(/^[.,\s]+/u, '');
    const quoted = /^“([^”]+)”\s*[.,]?\s*(.*)$/su.exec(work);
    const parts = quoted || (entry.closest('#books') && /^(.+?)\.\s+(.+)$/su.exec(work));
    if (!parts) return;

    const title = document.createElement('h3');
    title.textContent = parts[1].trim().replace(/[.,]$/u, '');

    const authors = document.createElement('p');
    authors.className = 'pub-authors';
    authors.textContent = prefix.slice(0, date?.index ?? prefix.length).trim();

    const details = document.createElement('p');
    details.className = 'pub-journal';
    details.textContent = [date?.[1], parts[2].trim()].filter(Boolean).join(' · ');

    // Keep the original citation available to search and to the content manager.
    copy.before(title, authors, details);
    copy.hidden = true;
  }

  for (const entry of document.querySelectorAll('#publication-list :is(.pub-entry, .citation-entry)')) {
    if (entry.classList.contains('citation-entry')) formatCitation(entry);

    const content = entry.querySelector('.publication-book-content') || entry;
    const heading = content.querySelector(':scope > h3, :scope > .publication-book-heading > h3');
    const sourceLink = content.querySelector(':scope > a.rise-link[href]');
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
