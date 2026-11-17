(() => {
  'use strict';
  function init() {
    const root = document.querySelector('#overview .rm2-flow');
    if (!root) return;
    const map = {
      material: ['low', 'environment', 'data'],
      structure: ['composites', 'durability', 'data'],
      system: ['composites', 'durability', 'extreme']
    };
    const buttons = Array.from(root.querySelectorAll('.rm2-stage'));
    const topics = Array.from(root.querySelectorAll('.rm2-topic'));
    const status = root.querySelector('.rm2-status');
    const reset = root.querySelector('.rm2-reset');
    function select(key) {
      const selected = key && map[key] ? key : null;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.stage === selected)));
      topics.forEach(topic => {
        if (!selected) delete topic.dataset.related;
        else topic.dataset.related = String(map[selected].includes(topic.dataset.topic));
      });
      if (!selected) status.textContent = 'All 6 research areas are shown.';
      else {
        const count = topics.filter(topic => topic.dataset.related === 'true').length;
        const label = buttons.find(button => button.dataset.stage === selected).querySelector('strong').textContent;
        status.textContent = `${count} of ${topics.length} areas connect to ${label}.`;
      }
    }
    buttons.forEach(button => button.addEventListener('click', () => select(button.getAttribute('aria-pressed') === 'true' ? null : button.dataset.stage)));
    reset.addEventListener('click', () => select(null));
    select(null);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
