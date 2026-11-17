(() => {
  'use strict';

  // Y. Li is ambiguous, so only identify him where the publication metadata
  // confirms Yinjian Li. Other patterns use the lab's known author names.
  const klayDois = new Set([
    '10.1021/acsomega.6c02054',
    '10.1016/j.cacaie.2026.100009',
    '10.1016/j.checir.2026.100068'
  ]);
  const names = [
    'Q\\.\\s*Jin', 'Jin,\\s*Q\\.', 'Qingxu\\s+(?:[“"\']Bill[”"\']\\s+)?Jin',
    'M\\.\\s*Leon[-–]Miquel', 'Matias\\s+Leon[-–]Miquel', 'Leon[-–]Miquel,\\s*M\\.',
    'N\\.\\s*Denning', 'Nathan\\s+Denning', 'Denning,\\s*N\\.',
    'X\\.\\s*Ni', 'Xiaoqiang\\s+Ni', 'Ni,\\s*X\\.',
    'B\\.\\s*(?:S\\.\\s*)?Byers', 'Brandon(?:\\s+S\\.)?\\s+Byers', 'Byers,\\s*B\\.(?:\\s*S\\.)?',
    'D\\.\\s*Aparicio(?:\\s+Vallejos)?', 'Diego\\s+Aparicio(?:\\s+Vallejos)?', 'Aparicio(?:\\s+Vallejos)?,\\s*D\\.',
    'Q\\.\\s*R\\.\\s*Greiner', 'Quentin(?:\\s+R\\.)?\\s+Greiner', 'Greiner,\\s*Q\\.\\s*R\\.',
    'Yinjian(?:\\s+[“"\']Klay[”"\'])?\\s+Li', 'Li,\\s*Yinjian'
  ];

  function highlight(element, allowKlayInitial) {
    const patterns = allowKlayInitial ? names.concat(['Y\\.\\s*Li', 'Li,\\s*Y\\.']) : names;
    const matcher = new RegExp('\\b(?:' + patterns.join('|') + ')(?![A-Za-z])', 'g');
    let limit = element.textContent.length;
    if (element.classList.contains('citation-copy')) {
      const full = element.textContent;
      const stops = [full.indexOf('“'), full.indexOf('"'), full.search(/\s\((?:19|20)\d{2}\)/), full.indexOf(', eds.')].filter(i => i >= 0);
      if (stops.length) limit = Math.min(...stops);
    }
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const pieces=[]; let current; let offset=0;
    while ((current=walker.nextNode())) {
      const value=current.nodeValue;
      const allowed=Math.max(0, Math.min(value.length, limit-offset));
      const protectedNode=current.parentElement.closest('strong, b, a');
      if (allowed && !protectedNode) pieces.push({node:current, allowed});
      offset+=value.length;
    }
    for (const {node,allowed} of pieces) {
      const value=node.nodeValue, segment=value.slice(0,allowed);
      const matches=[...segment.matchAll(matcher)];
      if (!matches.length) continue;
      const fragment=document.createDocumentFragment(); let cursor=0;
      for(const match of matches) {
        fragment.appendChild(document.createTextNode(value.slice(cursor,match.index)));
        const strong=document.createElement('strong');
        strong.textContent=match[0];
        fragment.appendChild(strong);
        cursor=match.index+match[0].length;
      }
      fragment.appendChild(document.createTextNode(value.slice(cursor)));
      node.parentNode.replaceChild(fragment,node);
    }
  }

  for (const entry of document.querySelectorAll('.pub-entry, .citation-entry')) {
    const doiLink=entry.querySelector('a[href^="https://doi.org/"]');
    const doi=doiLink ? decodeURIComponent(new URL(doiLink.href).pathname.slice(1)).toLowerCase() : '';
    const element=entry.querySelector('.pub-authors, .citation-copy');
    if (element) highlight(element,klayDois.has(doi));
  }
})();
