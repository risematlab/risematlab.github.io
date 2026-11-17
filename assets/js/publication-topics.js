(function () {
  'use strict';

  // Curated topic assignments are based on each journal article's subject.
  // An article can appear in more than one topic. Records without an assignment
  // remain visible in All rather than receiving a guessed classification.
  var topicsByDoi = {
    '10.1061/jmcee7.mteng-24277': ['energy', 'materials', 'composites'],
    '10.1061/jmcee7.mteng-22054': ['materials'],
    '10.1038/s44453-026-00047-8': ['materials'],
    '10.1021/acsomega.6c02054': ['energy', 'materials'],
    '10.1016/j.cacaie.2026.100009': ['materials', 'composites'],
    '10.1016/j.conbuildmat.2026.148108': ['materials'],
    '10.1016/j.jobe.2026.117085': ['materials'],
    '10.1016/j.cemconcomp.2025.106104': ['materials'],
    '10.1617/s11527-025-02744-4': ['structures', 'materials', 'composites'],
    '10.1016/j.cement.2024.100119': ['materials'],
    '10.1016/j.resconrec.2023.107098': ['materials', 'composites'],
    '10.1186/s43065-023-00091-8': ['structures', 'materials'],
    '10.1016/j.cemconres.2023.107164': ['materials', 'composites'],
    '10.1016/j.cemconres.2022.106882': ['materials'],
    '10.1016/j.conbuildmat.2022.128308': ['materials', 'composites'],
    '10.1016/j.resconrec.2021.106038': ['materials', 'composites'],
    '10.1016/j.hazadv.2022.100154': ['materials'],
    '10.1016/j.conbuildmat.2022.129337': ['materials'],
    '10.1016/j.cemconres.2021.106381': ['materials'],
    '10.1016/j.cej.2020.127098': ['materials'],
    '10.1016/j.cemconres.2019.105969': ['materials'],
    '10.1016/j.engstruct.2019.109338': ['energy', 'structures', 'materials', 'composites'],
    '10.1016/j.cemconcomp.2018.11.016': ['energy', 'structures', 'materials', 'composites'],
    '10.1016/j.cemconres.2019.05.010': ['materials'],
    '10.1617/s11527-012-9905-3': ['structures', 'materials', 'composites'],
    '10.1061/(asce)cc.1943-5614.0000211': ['structures', 'materials', 'composites']
  };

  var labels = {
    all: 'All topics',
    energy: 'Energy',
    structures: 'Structures',
    materials: 'Materials',
    composites: 'Composites'
  };

  function start() {
    var input = document.getElementById('publication-search');
    var search = document.querySelector('.publication-search');
    if (!input || !search || document.querySelector('.publication-topic-filter')) return;

    var entries = Array.prototype.slice.call(document.querySelectorAll('.pub-year .pub-entry'));
    var years = Array.prototype.slice.call(document.querySelectorAll('.pub-year'));
    var status = document.getElementById('publication-search-status');
    var current = new URLSearchParams(window.location.search).get('topic') || 'all';
    if (!Object.prototype.hasOwnProperty.call(labels, current)) current = 'all';

    var group = document.createElement('div');
    group.className = 'publication-topic-filter';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Filter journal articles by topic');
    var heading = document.createElement('p');
    heading.className = 'rise-eyebrow';
    heading.textContent = 'Filter journal articles by topic';
    group.appendChild(heading);
    var controls = document.createElement('div');
    controls.className = 'publication-topic-controls';
    group.appendChild(controls);

    function doiFor(entry) {
      var link = entry.querySelector('a[href*="doi.org/"]');
      if (!link) return '';
      try {
        return decodeURIComponent(new URL(link.href).pathname.replace(/^\/+/, '')).toLowerCase();
      } catch (error) {
        return '';
      }
    }

    function filter() {
      var query = input.value.trim().toLocaleLowerCase();
      var count = 0;
      entries.forEach(function (entry) {
        var assigned = topicsByDoi[doiFor(entry)] || [];
        var matchesTopic = current === 'all' || assigned.indexOf(current) !== -1;
        var matchesSearch = !query || entry.textContent.toLocaleLowerCase().indexOf(query) !== -1;
        var visible = matchesTopic && matchesSearch;
        entry.hidden = !visible;
        if (visible) count++;
      });
      years.forEach(function (year) {
        year.hidden = !Array.prototype.some.call(year.querySelectorAll('.pub-entry'), function (entry) {
          return !entry.hidden;
        });
      });
      Array.prototype.forEach.call(controls.querySelectorAll('button'), function (button) {
        button.setAttribute('aria-pressed', button.dataset.topic === current ? 'true' : 'false');
      });
      if (status) {
        status.textContent = (current !== 'all' || query)
          ? count + ' journal article' + (count === 1 ? '' : 's') + ' found' + (current !== 'all' ? ' in ' + labels[current] : '') + '.'
          : '';
      }
    }

    Object.keys(labels).forEach(function (key) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'publication-topic-button';
      button.dataset.topic = key;
      button.textContent = labels[key];
      button.addEventListener('click', function () {
        current = key;
        try {
          var url = new URL(window.location.href);
          if (key === 'all') url.searchParams.delete('topic');
          else url.searchParams.set('topic', key);
          window.history.replaceState(null, '', url.href);
        } catch (error) { /* Filtering still works when history is unavailable. */ }
        filter();
      });
      controls.appendChild(button);
    });

    search.insertAdjacentElement('afterend', group);
    // The existing title/author search runs first; this handler then applies the
    // intersection of the current topic and query.
    input.addEventListener('input', filter);
    filter();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}());
