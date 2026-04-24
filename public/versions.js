(async () => {
  const el = document.getElementById('brainjar-versions');
  if (!el) return;
  try {
    const res = await fetch('/versions.json');
    if (!res.ok) return;
    const v = await res.json();
    if (v.brainjar) {
      const s = document.createElement('span');
      s.textContent = 'brainjar ' + v.brainjar;
      el.appendChild(s);
      el.classList.add('loaded');
    }
  } catch {}
})();
