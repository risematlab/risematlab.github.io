(() => {
  'use strict';
  const panel=document.querySelector('.mc-panel');
  if(!panel) return;
  const cards=[...panel.querySelectorAll('.mc-topic')];
  const markers=[...panel.querySelectorAll('.mc-node')];
  let hovered=null,focused=null;
  const activate=()=>{
    const active=focused || hovered;
    panel.classList.toggle('has-active',Boolean(active));
    for(const element of [...cards,...markers]) element.classList.toggle('is-active',element.dataset.topic===active);
  };
  for(const card of cards){
    card.addEventListener('pointerenter',()=>{hovered=card.dataset.topic;activate();});
    card.addEventListener('pointerleave',()=>{hovered=null;activate();});
    card.addEventListener('focus',()=>{focused=card.dataset.topic;activate();});
    card.addEventListener('blur',()=>{focused=null;activate();});
  }
  for(const marker of markers){
    marker.addEventListener('pointerenter',()=>{hovered=marker.dataset.topic;activate();});
    marker.addEventListener('pointerleave',()=>{hovered=null;activate();});
  }
  // Start hidden only when animation can actually be scheduled. No JS, reduced
  // motion, and unsupported IntersectionObserver all retain the static figure.
  const motion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)');
  const desktop=window.matchMedia && window.matchMedia('(min-width: 1100px)');
  if(!motion || !motion.matches || !desktop || !desktop.matches || !('IntersectionObserver' in window)) return;
  panel.classList.add('mc-waiting');
  const curve=panel.querySelector('.mc-curve');
  curve.addEventListener('animationend',event=>{
    if(event.animationName==='mc-draw') panel.classList.remove('mc-animate');
  });
  try {
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting)) return;
      panel.classList.remove('mc-waiting');
      panel.classList.add('mc-animate');
      observer.disconnect();
    },{threshold:.15});
    observer.observe(panel);
  } catch(error) {
    panel.classList.remove('mc-waiting');
  }
})();
