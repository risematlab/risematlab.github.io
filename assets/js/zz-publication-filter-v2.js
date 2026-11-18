(() => {
  'use strict';
  const labels = {
    all: 'All topics',
    composites: 'Composites & mechanics',
    data: 'Data-driven design & characterization',
    extreme: 'Extreme environments & space',
    low: 'Decarbonization & circularity',
    environment: 'Environmental & functional materials',
    durability: 'Durability & infrastructure preservation',
    other: 'Other research',
  };
  // Assignments are curated against titles on the existing page; unassigned interdisciplinary
  // records remain available under All topics. Multiple labels are intentional.
  const rules = [
    ['phase change materials in concrete',['environment','durability']],
    ['desert sands',['extreme','durability']], ['lunar and martian regolith',['extreme']],
    ['carbonated ductile well cement',['data','extreme','composites']],
    ['adaptive deep neural network',['data','composites']], ['rare earths across secondary',['low']],
    ['copper mine tailings',['low']], ['alkali–silica reaction',['low','durability']],
    ['circular economy for post-hazard',['low','durability']], ['particle packing approach',['low']],
    ['seismic and wind resistance',['low','composites']], ['low-grade fly ash',['low']],
    ['chilean natural pozzolan',['low','composites']], ['crack sealers',['durability']],
    ['microtomography image segmentation',['data','composites']],
    ['nox uptake capacities',['environment']], ['uhpc placement and fiber',['composites']],
    ['high-volume regenerative biosilica',['low','composites','durability']],
    ['immobilization of potentially toxic',['environment','low']], ['steel rebar corrosion',['durability']],
    ['nox sequestration by calcium',['environment']],
    ['granular media dissolve',['data']], ['gypsum dissolution rates',['data']],
    ['ecc/concrete dual-layer',['composites','durability']], ['lightweight engineered cementitious',['composites','durability']],
    ['nox uptake in plain',['environment']], ['pseudo-ductile permanent formwork',['composites']],
    ['fiber-reinforced-cementitious-composites plate',['composites']],
    ['titania and silica nanoparticle-modified coatings',['environment']],
    ['photocatalytic products of nox',['environment']], ['concrete deterioration for optimizing',['durability','data']],
    ['frcc and frp for the joining',['composites']], ['joining method for permanent formwork',['composites']],
    ['frcc) plate for the anchoring',['composites']], ['advanced concrete technology in tall wind towers',['composites','durability']],
    ['dissolution kinetics of calcium salts',['data']], ['air-purification and self-cleaning',['environment']],
    ['enhanced corrosion resistance',['environment','durability']], ['nox photocatalytic degradation',['environment']],
    ['nox sequestration of photocatalytic',['environment']], ['photo-cements with self-cleaning',['environment']],
    ['where does nitrogen go',['environment']], ['industrial decarbonization: materials',['low']],
    ['circular economy perspectives and innovations',['low']], ['nano tio2-engineered',['environment']]
  ];
  const legacy = {
    energy: ['phase change materials in concrete','carbonated ductile well cement','ecc/concrete dual-layer','lightweight engineered cementitious'],
    structures: ['seismic and wind resistance','crack sealers','ecc/concrete dual-layer','lightweight engineered cementitious','pseudo-ductile permanent formwork','fiber-reinforced-cementitious-composites plate'],
    composites: ['phase change materials in concrete','adaptive deep neural network','seismic and wind resistance','chilean natural pozzolan','microtomography image segmentation','uhpc placement and fiber','high-volume regenerative biosilica','ecc/concrete dual-layer','lightweight engineered cementitious','pseudo-ductile permanent formwork','fiber-reinforced-cementitious-composites plate'],
    materials: ['phase change materials in concrete','desert sands','lunar and martian regolith','carbonated ductile well cement','adaptive deep neural network','copper mine tailings','alkali–silica reaction','particle packing approach','seismic and wind resistance','low-grade fly ash','chilean natural pozzolan','crack sealers','microtomography image segmentation','nox uptake capacities','uhpc placement and fiber','high-volume regenerative biosilica','immobilization of potentially toxic','steel rebar corrosion','nox sequestration by calcium','granular media dissolve','gypsum dissolution rates','ecc/concrete dual-layer','lightweight engineered cementitious','nox uptake in plain','pseudo-ductile permanent formwork','fiber-reinforced-cementitious-composites plate']
  };
  function start() {
    const intro=document.querySelector('#publication-list'), oldInput=document.querySelector('#publication-search');
    const years=[...document.querySelectorAll('.pub-year')];
    const journalSection=intro?.querySelector('#journals');
    const categories=[...document.querySelectorAll('.publication-category')].filter(section=>section!==journalSection);
    if (!intro || !oldInput || !years.length || !categories.length || document.querySelector('#publication-filters-v2')) return;
    const rows=[...years.flatMap(section=>[...section.querySelectorAll('.pub-entry')].map(el=>({el,section,type:'journal'}))),...categories.flatMap(section=>[...section.querySelectorAll('.citation-entry')].map(el=>({el,section,type:section.id})))];
    rows.forEach(row=>{
      const citation=row.el.querySelector(':scope > .citation-copy');
      const source=row.el.querySelector(':scope > .rise-link');
      row.text=(citation ? citation.textContent + (source?.textContent || '') : row.el.textContent).toLocaleLowerCase();
       row.topics=new Set(); const managed=row.el.getAttribute('data-admin-topics'); if(managed!==null) managed.split(/\s+/).filter(Boolean).forEach(tag=>row.topics.add(tag)); else rules.forEach(([needle,tags])=>{if(row.text.includes(needle)) tags.forEach(tag=>row.topics.add(tag));});});
    // Keep the visible topic labels in the same taxonomy and order as the filter.
    // Items outside the six research areas remain available under All topics.
    rows.forEach(row=>{
      if(row.type==='journal') {
        const eyebrow=row.el.querySelector('.rise-eyebrow');
        if(eyebrow) eyebrow.textContent=eyebrow.textContent.split('·')[0].trim();
      }
      const tags=Object.keys(labels).filter(key=>key!=='all' && row.topics.has(key));
      if(!tags.length) return;
      const list=document.createElement('div'); list.className='publication-topic-tags'; list.setAttribute('aria-label','Research areas');
      tags.forEach(key=>{const tag=document.createElement('span'); tag.textContent=labels[key]; list.append(tag);});
      if(row.type==='journal') {
        const journal=row.el.querySelector('.pub-journal');
        if(journal) journal.after(list); else row.el.querySelector('h3')?.after(list);
      } else {
        const content = row.el.querySelector('.publication-book-content') || row.el;
        content.append(list);
      }
    });
    const oldGroup=document.querySelector('.publication-topic-filter'); if(oldGroup) oldGroup.remove();
    const oldNav=document.querySelector('.publication-categories'); if(oldNav) oldNav.hidden=true;
    const input=oldInput;
    input.placeholder='Title, author or keyword'; input.setAttribute('aria-label','Search all publications');
    const searchLabel=intro.querySelector('.publication-search .rise-eyebrow'); if(searchLabel) searchLabel.textContent='Search publications';
    const status=document.getElementById('publication-search-status'); if(status) status.setAttribute('role','status');
    const box=document.createElement('div'); box.id='publication-filters-v2';
    const css=document.createElement('style'); css.textContent='.publication-topic-tags{display:flex;flex-wrap:wrap;gap:6px 10px;margin:10px 0 14px}.publication-topic-tags span{font-size:12px;line-height:1.35;color:#36584c;background:#edf3ec;padding:4px 8px;border-radius:3px}#publication-filters-v2{margin:26px 0 0} .pub-filter-row{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:0 0 18px} .pub-filter-row .rise-eyebrow{flex:0 0 145px;margin:0} .pub-filter-row button{font:inherit;font-size:14px;font-weight:650;color:#124c40;background:#fff;border:1px solid #cddfd2;border-radius:4px;padding:10px 13px;cursor:pointer} .pub-filter-row button[aria-pressed=true]{color:white;background:#124c40;border-color:#124c40} .pub-filter-row button:hover{border-color:#124c40}.pub-filter-row button:focus-visible{outline:3px solid #93bc66;outline-offset:3px}.pub-year[hidden],.publication-category[hidden],.pub-entry[hidden],.citation-entry[hidden],.publication-categories[hidden],.publication-topic-filter[hidden]{display:none!important}@media(max-width:700px){.pub-filter-row .rise-eyebrow{flex-basis:100%}}';document.head.append(css);
    function group(title,items,fn){const row=document.createElement('div');row.className='pub-filter-row';row.setAttribute('role','group');row.setAttribute('aria-label',title);const l=document.createElement('p');l.className='rise-eyebrow';l.textContent=title;row.append(l); const buttons=items.map(([key,label])=>{const b=document.createElement('button');b.type='button';b.dataset.key=key;const text=document.createElement('span');text.className='pub-topic-label';text.textContent=label;b.append(text);b.addEventListener('click',()=>fn(key));row.append(b);return b;});box.append(row);return buttons;}
    let selectedTopic='all', legacyTopic='';
    const query=new URLSearchParams(location.search).get('topic');
    if(query === 'composite-structural') selectedTopic='composites';
    else if(query && Object.hasOwn(labels,query) && query !== 'composites') selectedTopic=query;
    else if(query && Object.hasOwn(legacy,query)) legacyTopic=query;
    const topicButtons=group('Filter by topic',Object.entries(labels),key=>{selectedTopic=key;legacyTopic=''; updateUrl(key);apply();});
    const reset=document.createElement('button');reset.type='button';reset.textContent='Clear filters';reset.className='publication-clear';reset.addEventListener('click',()=>{selectedTopic='all';legacyTopic='';input.value='';if(mobileYear)mobileYear.value='all';updateUrl('all');apply();});box.append(reset);intro.querySelector('.publication-search').after(box);
    // The mobile controls share the existing search and topic state. Desktop
    // keeps its original controls and does not apply the mobile journal year.
    const mobile = intro.querySelector('.publication-mobile-filters');
    const phoneWidth = matchMedia('(max-width: 767.98px)');
    const mobileTopic = mobile?.querySelector('#publication-mobile-topic');
    const mobileYear = mobile?.querySelector('#publication-mobile-year');
    const mobileReset = mobile?.querySelector('.publication-mobile-reset');
    const mobileSelection = mobile?.querySelector('.publication-mobile-selection');
    const mobileMeta = intro.querySelector('.publication-mobile-meta');
    const searchBox = input.closest('.publication-search');

    function syncMobileControls() {
      if (!mobile) return;

      const previousOption = mobileTopic.querySelector('option[value="legacy"]');
      if (legacyTopic && !previousOption) {
        mobileTopic.add(new Option('Previous topic: ' + legacyTopic, 'legacy'));
      } else if (!legacyTopic && previousOption) {
        previousOption.remove();
      }

      mobileTopic.value = legacyTopic ? 'legacy' : selectedTopic;
      const topicLabel = legacyTopic ? 'Previous topic: ' + legacyTopic : labels[selectedTopic];
      const yearLabel = mobileYear.value === 'all' ? 'All years' : mobileYear.value;
      mobileSelection.textContent = topicLabel + ' · ' + yearLabel;
      mobileReset.hidden = reset.hidden && mobileYear.value === 'all';
    }

    function updateMobileControls() {
      const isPhone = phoneWidth.matches;
      mobile.hidden = !isPhone;
      mobileMeta.hidden = !isPhone;
      if (status) {
        if (isPhone) mobileMeta.prepend(status);
        else searchBox.append(status);
      }
    }

    if (mobile) {
      for (const [key, label] of Object.entries(labels)) {
        mobileTopic.add(new Option(label, key));
      }
      mobileYear.add(new Option('All years', 'all'));
      for (const section of years) {
        const year = section.id.slice('year-'.length);
        mobileYear.add(new Option(year, year));
      }

      mobileTopic.addEventListener('change', () => {
        if (mobileTopic.value !== 'legacy') {
          selectedTopic = mobileTopic.value;
          legacyTopic = '';
        }
        updateUrl(legacyTopic || selectedTopic);
        apply();
      });
      mobileYear.addEventListener('change', apply);
      mobileReset.addEventListener('click', () => {
        reset.click();
        input.focus();
      });
      phoneWidth.addEventListener('change', () => {
        updateMobileControls();
        apply();
      });

      intro.classList.add('publication-mobile-ready');
      updateMobileControls();
    }

    function updateUrl(key){try{const u=new URL(location.href);if(key==='all')u.searchParams.delete('topic');else u.searchParams.set('topic',key==='composites'?'composite-structural':key);history.replaceState(null,'',u);}catch(e){}}
    function apply(){const q=input.value.trim().toLocaleLowerCase();let count=0;
      rows.forEach(row=>{const topicMatch=legacyTopic ? row.type==='journal'&&(legacy[legacyTopic]||[]).some(x=>row.text.includes(x)) : selectedTopic==='all'||row.topics.has(selectedTopic);const yearMatch = !mobile || !phoneWidth.matches || mobileYear.value === 'all' || row.section.id === 'year-' + mobileYear.value;const visible=topicMatch&&yearMatch&&(!q||row.text.includes(q));row.el.hidden=!visible;if(visible)count++;});
      [...years,...categories].forEach(section=>{section.hidden=!rows.some(row=>row.section===section&&!row.el.hidden);});
      if(journalSection) journalSection.hidden=years.every(section=>section.hidden);
      topicButtons.forEach(b=>b.setAttribute('aria-pressed',String(!legacyTopic&&b.dataset.key===selectedTopic)));
      if(status)status.textContent=legacyTopic?`Showing ${count} results for previous topic: ${legacyTopic}. Select a new topic or clear filters.`:`Showing ${count} publication${count===1?'':'s'}.`;
      reset.hidden=!(input.value.length || selectedTopic!=='all' || legacyTopic);
      syncMobileControls();
    }
    input.addEventListener('input',apply);apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
