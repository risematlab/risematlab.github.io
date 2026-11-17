(() => {
  const details = document.querySelectorAll('.person-details');
  const compact = window.matchMedia('(max-width: 767.98px)');

  function updateDisclosures() {
    for (const item of details) {
      item.open = !compact.matches;
    }
  }

  updateDisclosures();
  compact.addEventListener('change', updateDisclosures);
})();
