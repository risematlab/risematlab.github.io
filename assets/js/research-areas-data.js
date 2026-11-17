/* Shared titles for the home research cards and matching Research areas. */
(() => {
  'use strict';
  const areas = [
    { id: 'low-carbon', topic: 'low', shortTitle: 'Low-carbon cementitious materials', fullTitle: 'Low-carbon & circular materials' },
    { id: 'resilient', topic: 'composites', shortTitle: 'Resilient composites', fullTitle: 'Composites & structural performance' },
    { id: 'environment', topic: 'environment', shortTitle: 'Environmental materials', fullTitle: 'Environmental & functional materials' }
  ];
  function renderTitles() {
    areas.forEach(area => {
      const short = document.querySelector(`#home-research .rise-card[data-area="${area.id}"] h3`);
      const topic = document.querySelector(`#overview .rm2-topic[data-topic="${area.topic}"] .rm2-topic-title`);
      const detail = document.querySelector(`#${area.id} h2`);
      if (short) short.textContent = area.shortTitle;
      if (topic) topic.textContent = area.fullTitle;
      if (detail) detail.textContent = area.fullTitle;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderTitles, { once: true });
  else renderTitles();
})();
