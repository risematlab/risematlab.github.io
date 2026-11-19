(() => {
  'use strict';
  const topics = [
    { key: 'research', label: 'Research', ids: [1, 4, 7, 10, 11, 12, 14, 15, 16, 17, 22, 26, 27, 28, 29, 34, 37, 40, 43] },
    { key: 'publication', label: 'Publication', ids: [10, 11, 12, 14, 15, 16, 22, 26, 27, 28, 36, 37, 40, 43] },
    { key: 'team', label: 'Team', ids: [3, 8, 9, 23, 24, 25, 29, 30, 31, 32, 33, 34, 35, 38, 39, 41, 42, 44, 45] },
    { key: 'media', label: 'Media', ids: [3, 4, 46] },
    { key: 'award', label: 'Award', ids: [9, 30, 35, 39, 41, 45] },
    { key: 'outreach', label: 'Outreach', ids: [5, 17, 46] },
  ];
  const start = () => {
    const yearsBar = document.querySelector('#stories .rise-filter-links');
    const years = [...document.querySelectorAll('#stories .news-year')];
    if (!yearsBar || !years.length || document.querySelector('#news-topic-filter')) return;
    const cards = years.flatMap(year => [...year.querySelectorAll('.news-card')].map(card => {
      const href = card.querySelector('a[href*="news-"]')?.getAttribute('href') || '';
      const match = href.match(/(?:^|\/)news-(\d+)\.html(?:[?#]|$)/);
      return { card, id: match ? Number(match[1]) : null };
    }));
    const style = document.createElement('style');
    style.textContent = `
      #news-topic-filter { display:flex; align-items:center; flex-wrap:wrap; gap:12px; margin:18px 0 28px; }
      #news-topic-filter .rise-eyebrow { margin:0 12px 0 0; }
      #news-topic-filter button { font:inherit; font-size:14px; font-weight:650; color:#124c40; background:#fff; border:1px solid #cfdfd3; border-radius:4px; padding:10px 14px; cursor:pointer; }
      #news-topic-filter button:hover { border-color:#124c40; }
      #news-topic-filter button[aria-pressed="true"] { color:#fff; background:#124c40; border-color:#124c40; }
      #news-topic-filter button:focus-visible { outline:3px solid #93bc66; outline-offset:3px; }
      #stories .news-card[hidden], #stories .news-year[hidden], #stories .rise-filter-links a[hidden] { display:none !important; }
      #news-topic-status { margin:0 0 20px; color:#53645f; font-size:14px; }
      @media(max-width:600px) { #news-topic-filter .rise-eyebrow { flex-basis:100%; } }
    `;
    document.head.append(style);
    const bar = document.createElement('div');
    bar.id = 'news-topic-filter';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Browse news by topic');
    const label = document.createElement('p');
    label.className = 'rise-eyebrow';
    label.textContent = 'Browse by topic';
    bar.append(label);
    const status = document.createElement('p');
    status.id = 'news-topic-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const options = [{ key: 'all', label: 'All topics' }, ...topics];
    const buttons = options.map(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option.label;
      button.dataset.topic = option.key;
      button.setAttribute('aria-pressed', String(option.key === 'all'));
      bar.append(button);
      return button;
    });
    yearsBar.after(bar, status);
    function apply(option) {
      const allowed = option.ids ? new Set(option.ids) : null;
      cards.forEach(({ card, id }) => { card.hidden = Boolean(allowed && !allowed.has(id)); });
      years.forEach(year => {
        const isEmpty = !year.querySelector('.news-card:not([hidden])');
        year.hidden = isEmpty;
        const link = [...yearsBar.querySelectorAll('a[href^="#"]')].find(a => a.getAttribute('href') === '#' + year.id);
        if (link) link.hidden = isEmpty;
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === option.key)));
      const count = cards.filter(({ card }) => !card.hidden).length;
      status.textContent = option.key === 'all' ? `Showing all ${count} stories.` : `Showing ${count} ${count === 1 ? 'story' : 'stories'} in ${option.label}.`;
    }
    buttons.forEach((button, i) => button.addEventListener('click', () => apply(options[i])));
    apply(options[0]);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
