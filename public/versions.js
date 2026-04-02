(async () => {
  const el = document.getElementById('brainjar-versions');
  if (!el) return;
  try {
    const res = await fetch('/versions.json');
    if (!res.ok) return;
    const v = await res.json();
    if (v.cli) {
      const s = document.createElement('span');
      s.textContent = 'cli ' + v.cli;
      el.appendChild(s);
    }
    if (v.server) {
      const s = document.createElement('span');
      s.textContent = 'server ' + v.server;
      el.appendChild(s);
    }
    if (el.children.length) el.classList.add('loaded');
  } catch {}
})();
