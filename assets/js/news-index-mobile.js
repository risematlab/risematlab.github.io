(() => {
  'use strict';

  function initializeMobileControls() {
    const archive = document.querySelector('#stories');
    if (!archive) return;

    const topicSelect = archive.querySelector('#news-mobile-topic');
    const yearSelect = archive.querySelector('#news-mobile-year');
    const topicButtons = [...archive.querySelectorAll('#news-topic-filter button')];
    const yearLinks = [...archive.querySelectorAll('.rise-filter-links a')];
    if (!topicSelect || !yearSelect || !topicButtons.length || !yearLinks.length) return;

    for (const button of topicButtons) {
      topicSelect.add(new Option(button.textContent, button.dataset.topic));
    }

    function syncControls() {
      const activeTopic = topicButtons.find(button => button.getAttribute('aria-pressed') === 'true');
      if (!activeTopic) return false;
      topicSelect.value = activeTopic.dataset.topic;
      archive.classList.toggle('news-topic-active', activeTopic.dataset.topic !== 'all');

      yearSelect.replaceChildren(new Option('Choose year', ''));
      for (const link of yearLinks) {
        if (!link.hidden) yearSelect.add(new Option(link.textContent, link.hash));
      }
      return true;
    }

    if (!syncControls()) return;
    topicSelect.addEventListener('change', () => {
      topicButtons.find(button => button.dataset.topic === topicSelect.value)?.click();
    });
    yearSelect.addEventListener('change', () => {
      const link = yearLinks.find(link => link.hash === yearSelect.value);
      if (!link) return;
      if (location.hash === link.hash) {
        document.getElementById(link.hash.slice(1))?.scrollIntoView();
      } else {
        link.click();
      }
      yearSelect.value = '';
    });
    // The existing topic filter runs first and updates the archive.
    for (const button of topicButtons) button.addEventListener('click', syncControls);

    archive.classList.add('news-mobile-controls-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileControls, { once: true });
  } else {
    initializeMobileControls();
  }
})();
