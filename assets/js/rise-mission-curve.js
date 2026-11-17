/* Our Lab research-topics plot: draw the trace once on first view, and light the trace up to the topic in focus. */
(() => {
  'use strict';
  const start = () => {
    const figure = document.querySelector('.mc-figure');
    if (!figure) return;

    const progress = figure.querySelector('.mc-progress');
    if (progress) {
      const show = topic => { progress.style.strokeDasharray = (topic ? getComputedStyle(topic).getPropertyValue('--p').trim() || '0' : '0') + ' 1000'; };
      figure.querySelectorAll('.mc-topic').forEach(topic => {
        topic.addEventListener('mouseenter', () => show(topic));
        topic.addEventListener('focus', () => show(topic));
        topic.addEventListener('mouseleave', () => show(null));
        topic.addEventListener('blur', () => show(null));
      });
    }

    if (!('IntersectionObserver' in window)) return;
    figure.classList.add('mc-anim');
    const seen = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { figure.classList.add('mc-in'); seen.disconnect(); }
    }, { threshold: 0.25 });
    seen.observe(figure);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
