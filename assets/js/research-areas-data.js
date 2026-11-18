/* Keep the homepage's research previews in the same order as the Research Areas page. */
(async () => {
  'use strict';

  const grid = document.querySelector('#home-research .rise-grid');
  if (!grid || !/^https?:$/.test(location.protocol)) return;

  const previews = new Map([...grid.children].map(card => [card.dataset.topic, card]));
  const researchPage = new URL('research.html', location.href);

  try {
    const response = await fetch(researchPage, { mode: 'same-origin' });
    if (!response.ok) return;

    const source = new DOMParser().parseFromString(await response.text(), 'text/html');
    const topics = [...source.querySelectorAll('#overview .rm2-topic')].slice(0, previews.size);
    const ordered = topics.map(topic => ({
      card: previews.get(topic.dataset.topic),
      title: topic.querySelector('.rm2-topic-title')?.textContent.trim(),
      hash: topic.getAttribute('href'),
    }));

    if (ordered.length !== previews.size ||
        ordered.some(({ card, title, hash }) => !card || !title || !/^#[\w-]+$/.test(hash))) return;

    for (const { card, title, hash } of ordered) {
      card.querySelector('h3').textContent = title;

      for (const link of card.querySelectorAll('a[href]')) {
        link.setAttribute('href', 'research.html' + hash);
        link.setAttribute('aria-label', link.classList.contains('home-card-text-link')
          ? title
          : 'Explore this research area: ' + title);
      }
    }

    const cards = [...grid.children];
    if (ordered.some(({ card }, index) => card !== cards[index])) {
      grid.append(...ordered.map(({ card }) => card));
    }
  } catch {
    // Keep the editorial previews when the Research page is unavailable.
  }
})();
