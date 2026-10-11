(function () {
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);

  const esc = (v) =>
    String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  // Deterministic pseudo-random numbers so each project's cover is stable.
  function rng(seed) {
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return () => {
      h = Math.imul(h ^ (h >>> 15), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  // ---- Diagram covers ------------------------------------------------------
  // Line drawings of what each system does. Ink uses currentColor; the one
  // highlighted element uses the accent.
  const MOTIFS = {
    agents(r) {
      const cx = 200, cy = 125, n = 6;
      let s = '';
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + r() * 0.4;
        const rad = 70 + r() * 22;
        const x = cx + Math.cos(a) * rad * 1.35, y = cy + Math.sin(a) * rad * 0.82;
        s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="ln"/>`;
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" class="node"/>`;
      }
      s += `<circle cx="${cx}" cy="${cy}" r="26" class="halo"/><circle cx="${cx}" cy="${cy}" r="15" class="hot"/>`;
      return s;
    },
    pipeline(r) {
      let s = '';
      const xs = [52, 162, 272];
      xs.forEach((x, i) => {
        const hot = i === 2;
        s += `<rect x="${x}" y="98" width="78" height="54" rx="8" class="${hot ? 'hot-box' : 'box'}"/>`;
        for (let l = 0; l < 3; l++) {
          const w = 30 + r() * 30;
          s += `<line x1="${x + 12}" y1="${114 + l * 11}" x2="${x + 12 + w}" y2="${114 + l * 11}" class="${hot ? 'hot-ln' : 'ln'}"/>`;
        }
        if (i < 2) s += `<path d="M${x + 84} 125 h20 m-6 -6 l6 6 l-6 6" class="ln"/>`;
      });
      for (let i = 0; i < 9; i++) s += `<circle cx="${30 + i * 9}" cy="${70 + r() * 12}" r="2" class="dot"/>`;
      return s;
    },
    workflow(r) {
      let s = `<line x1="60" y1="125" x2="340" y2="125" class="ln"/>`;
      const steps = 6, hot = 4;
      for (let i = 0; i < steps; i++) {
        const x = 60 + (i * 280) / (steps - 1);
        if (i < hot) {
          s += `<circle cx="${x}" cy="125" r="12" class="fill-ink"/><path d="M${x - 5} 125 l3.5 3.5 l6.5 -7" class="check"/>`;
        } else if (i === hot) {
          s += `<circle cx="${x}" cy="125" r="20" class="halo"/><circle cx="${x}" cy="125" r="12" class="hot"/>`;
        } else {
          s += `<circle cx="${x}" cy="125" r="12" class="node"/>`;
        }
        const w = 28 + r() * 16;
        s += `<line x1="${x - w / 2}" y1="${i % 2 ? 165 : 85}" x2="${x + w / 2}" y2="${i % 2 ? 165 : 85}" class="ln faint"/>`;
      }
      return s;
    },
    web(r) {
      let s = `<rect x="70" y="40" width="260" height="170" rx="10" class="box"/>`;
      s += `<line x1="70" y1="62" x2="330" y2="62" class="ln"/>`;
      s += [84, 94, 104].map((x) => `<circle cx="${x}" cy="51" r="3" class="dot"/>`).join('');
      s += `<line x1="90" y1="86" x2="${200 + r() * 40}" y2="86" class="ln thick"/>`;
      s += `<line x1="90" y1="100" x2="${170 + r() * 30}" y2="100" class="ln"/>`;
      s += `<rect x="90" y="112" width="52" height="16" rx="8" class="hot"/>`;
      for (let i = 0; i < 3; i++) s += `<rect x="${90 + i * 78}" y="146" width="66" height="46" rx="5" class="box"/>`;
      return s;
    },
    chart(r) {
      let s = `<line x1="50" y1="200" x2="350" y2="200" class="ln faint"/><line x1="50" y1="50" x2="50" y2="200" class="ln faint"/>`;
      s += `<line x1="50" y1="110" x2="350" y2="110" class="ln dash"/>`;
      let y = 170, pts = [];
      for (let i = 0; i <= 14; i++) {
        y = Math.max(60, Math.min(190, y + (r() - 0.56) * 34));
        pts.push(`${50 + i * 20},${y.toFixed(1)}`);
      }
      s += `<polyline points="${pts.join(' ')}" class="ln thick"/>`;
      const [lx, ly] = pts[pts.length - 1].split(',');
      s += `<circle cx="${lx}" cy="${ly}" r="14" class="halo"/><circle cx="${lx}" cy="${ly}" r="6" class="hot"/>`;
      return s;
    },
    map(r) {
      let s = '';
      const cols = 14, rows = 8, size = 17, gap = 4;
      const ox = 200 - (cols * (size + gap)) / 2, oy = 125 - (rows * (size + gap)) / 2;
      const hx = 3 + r() * 8, hy = 2 + r() * 4;
      for (let x = 0; x < cols; x++)
        for (let y = 0; y < rows; y++) {
          const d = Math.hypot(x - hx, (y - hy) * 1.3);
          const v = Math.max(0.06, 1 - d / 7) * (0.75 + r() * 0.25);
          const hot = d < 1.2;
          s += `<rect x="${(ox + x * (size + gap)).toFixed(1)}" y="${(oy + y * (size + gap)).toFixed(1)}" width="${size}" height="${size}" rx="3" class="${hot ? 'hot' : 'cell'}" style="${hot ? '' : `opacity:${v.toFixed(2)}`}"/>`;
        }
      return s;
    },
    voice(r) {
      let s = '';
      const n = 33;
      for (let i = 0; i < n; i++) {
        const x = 200 + (i - (n - 1) / 2) * 9;
        const env = Math.cos(((i - (n - 1) / 2) / n) * Math.PI);
        const h = 8 + env * (30 + r() * 70);
        const hot = Math.abs(i - (n - 1) / 2) < 3;
        s += `<line x1="${x}" y1="${(125 - h / 2).toFixed(1)}" x2="${x}" y2="${(125 + h / 2).toFixed(1)}" class="${hot ? 'hot-ln' : 'ln'} thick round"/>`;
      }
      return s;
    },
    brief(r) {
      let s = '';
      [[118, 70], [104, 60], [90, 50]].forEach(([x, y], i) => {
        s += `<rect x="${x}" y="${y}" width="190" height="130" rx="10" class="${i === 2 ? 'box solid' : 'box'}"/>`;
      });
      s += `<circle cx="125" cy="85" r="13" class="hot"/>`;
      for (let l = 0; l < 5; l++) s += `<line x1="${l === 0 ? 150 : 110}" y1="${85 + l * 21}" x2="${150 + r() * 110}" y2="${85 + l * 21}" class="ln${l === 0 ? ' thick' : ''}"/>`;
      return s;
    },
    migrate() {
      const server = (x, cls) =>
        [0, 1, 2]
          .map((i) => `<rect x="${x}" y="${78 + i * 32}" width="88" height="24" rx="5" class="${cls}"/><circle cx="${x + 14}" cy="${90 + i * 32}" r="3" class="${cls === 'box' ? 'dot' : 'dot-inv'}"/>`)
          .join('');
      return `${server(56, 'box faint-box')}${server(256, 'hot-box')}<path d="M156 125 h88 m-8 -8 l8 8 l-8 8" class="ln thick"/><line x1="56" y1="60" x2="144" y2="190" class="ln dash"/>`;
    },
    chat(r) {
      let s = `<rect x="60" y="56" width="150" height="46" rx="12" class="box"/><rect x="190" y="116" width="150" height="46" rx="12" class="hot-box"/>`;
      s += `<line x1="76" y1="74" x2="${140 + r() * 50}" y2="74" class="ln"/><line x1="76" y1="86" x2="${120 + r() * 40}" y2="86" class="ln"/>`;
      s += `<line x1="206" y1="134" x2="${270 + r() * 50}" y2="134" class="hot-ln"/><line x1="206" y1="146" x2="${250 + r() * 40}" y2="146" class="hot-ln"/>`;
      for (let i = 0; i < 3; i++) s += `<rect x="${70 + i * 10}" y="${130 + i * 8}" width="64" height="70" rx="5" class="box solid"/>`;
      s += `<path d="M150 175 Q 175 175 190 150" class="ln dash"/>`;
      return s;
    },
    house(r) {
      let s = `<path d="M120 120 L200 58 L280 120 V200 H120 Z" class="box"/><rect x="186" y="156" width="28" height="44" rx="3" class="box"/>`;
      const pts = [[150, 140], [250, 140], [150, 178], [250, 178], [200, 112]];
      pts.forEach(([x, y], i) => {
        if (i < 4) s += `<line x1="200" y1="112" x2="${x}" y2="${y}" class="ln faint"/>`;
      });
      pts.forEach(([x, y], i) => {
        s += i === 4 ? `<circle cx="${x}" cy="${y}" r="16" class="halo"/><circle cx="${x}" cy="${y}" r="8" class="hot"/>` : `<circle cx="${x}" cy="${y}" r="${5 + r() * 2}" class="node"/>`;
      });
      return s;
    },
    cards(r) {
      let s = '';
      [-14, -5, 4, 13].forEach((rot, i) => {
        const hot = i === 3;
        s += `<g transform="rotate(${rot} 200 210)"><rect x="168" y="62" width="64" height="92" rx="6" class="${hot ? 'hot-box' : 'box'}"/>${hot ? `<line x1="180" y1="80" x2="${205 + r() * 15}" y2="80" class="hot-ln"/>` : ''}</g>`;
      });
      let y = 214, pts = [];
      for (let i = 0; i <= 10; i++) { y = Math.max(196, Math.min(232, y + (r() - 0.6) * 12)); pts.push(`${100 + i * 20},${y.toFixed(1)}`); }
      s += `<polyline points="${pts.join(' ')}" class="ln thick"/>`;
      return s;
    },
    trio(r) {
      // Three agents, each wired to its own tools.
      let s = `<line x1="80" y1="88" x2="320" y2="88" class="ln dash"/>`;
      [100, 200, 300].forEach((x, i) => {
        const hot = i === 1;
        [-30, 0, 30].forEach((dx) => {
          s += `<line x1="${x}" y1="88" x2="${x + dx}" y2="166" class="ln faint"/><rect x="${x + dx - 11}" y="166" width="22" height="16" rx="4" class="${hot && dx === 0 ? 'hot-box' : 'box'}"/>`;
        });
        s += hot ? `<circle cx="${x}" cy="88" r="24" class="halo"/><circle cx="${x}" cy="88" r="13" class="hot"/>` : `<circle cx="${x}" cy="88" r="${12 + r() * 2}" class="node"/>`;
      });
      return s;
    },
    calendar(r) {
      let s = `<rect x="80" y="40" width="240" height="170" rx="10" class="box"/><line x1="80" y1="70" x2="320" y2="70" class="ln"/>`;
      const hot = Math.floor(r() * 7) + 7;
      for (let i = 0; i < 21; i++) {
        const x = 96 + (i % 7) * 31, y = 84 + Math.floor(i / 7) * 38;
        if (i === hot) s += `<rect x="${x - 2}" y="${y - 2}" width="26" height="26" rx="6" class="hot"/>`;
        else if (r() < 0.35) s += `<rect x="${x}" y="${y}" width="22" height="22" rx="5" class="fill-ink" style="opacity:.18"/>`;
        else s += `<rect x="${x}" y="${y}" width="22" height="22" rx="5" class="box"/>`;
      }
      return s;
    },
  };

  // images: [{ src, caption }]. The older single `image` field still works.
  const imagesOf = (p) => (p.images && p.images.length ? p.images : p.image ? [{ src: p.image, caption: '' }] : []);

  function shotHTML(img, cls = '') {
    return `<figure class="shot ${cls}"><a href="${esc(img.src)}" target="_blank" rel="noopener"><img src="${esc(img.src)}" alt="${esc(img.caption || '')}" loading="lazy"></a>${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ''}</figure>`;
  }

  function coverHTML(p) {
    const first = imagesOf(p)[0];
    if (first) return shotHTML(first, 'shot-cover');
    const draw = MOTIFS[p.cover] || MOTIFS.agents;
    return `<div class="cover" aria-hidden="true"><svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet">${draw(rng(p.id))}</svg></div>`;
  }

  const catLabel = (id) => (S.categories.find((c) => c.id === id) || {}).label || '';
  // "Health insurer · subcontract" -> "Health insurer" for the one-line row.
  const shortClient = (c) => String(c || '').split(' · ')[0];

  function rowHTML(p) {
    const id = esc(p.id);
    // Big projects open their own page; the row is a plain link with an arrow.
    if (p.page) {
      return `
      <li class="proj proj-page" id="${id}" data-cat="${esc(p.category)}">
        <h3 class="proj-head">
          <a class="proj-toggle" href="/projects/${id}">
            <span class="proj-num"></span>
            <span class="proj-title">${esc(p.title)}</span>
            <span class="proj-client">${esc(shortClient(p.client))}</span>
            <span class="proj-arrow" aria-hidden="true">→</span>
          </a>
        </h3>
      </li>`;
    }
    const facts = [
      ['Status', `<span class="status" data-status="${esc((p.status || '').toLowerCase())}">${esc(p.status)}</span>`],
      ['Client', esc(p.client)],
      p.role ? ['My role', esc(p.role)] : null,
      ['Type', esc(catLabel(p.category))],
      ['Year', esc(p.year)],
    ].filter(Boolean);
    const links = (p.links || [])
      .map((l) => `<a class="button button-ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} <span aria-hidden="true">↗</span></a>`)
      .join('');
    return `
      <li class="proj" id="${id}" data-cat="${esc(p.category)}">
        <h3 class="proj-head">
          <button type="button" class="proj-toggle" id="t-${id}" aria-expanded="false" aria-controls="p-${id}">
            <span class="proj-num"></span>
            <span class="proj-title">${esc(p.title)}</span>
            <span class="proj-client">${esc(shortClient(p.client))}</span>
            <span class="proj-icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="proj-panel" id="p-${id}" role="region" aria-labelledby="t-${id}" inert>
          <div>
            <div class="proj-body">
              <div class="proj-main">
                <p class="proj-summary">${esc(p.summary)}</p>
                ${p.highlights && p.highlights.length ? `<div><p class="proj-label">What I built</p><ul class="highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></div>` : ''}
                ${p.stack && p.stack.length ? `<div><p class="proj-label">Stack</p><ul class="tags">${p.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
                ${links ? `<div class="proj-links">${links}</div>` : ''}
              </div>
              <div class="proj-aside">
                ${coverHTML(p)}
                <dl class="facts-sm">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
              </div>
            </div>
          </div>
        </div>
      </li>`;
  }

  // ---- Shared footer -------------------------------------------------------
  function renderFooter() {
    const el = $('#footer');
    if (!el) return;
    const L = S.links;
    el.innerHTML = `
      <div class="wrap footer-inner">
        <div>
          <p class="footer-kicker">Say hi</p>
          <a class="footer-email" href="mailto:${esc(L.email)}">${esc(L.email)}</a>
        </div>
        <ul class="footer-links">
          <li><a href="${esc(L.linkedin)}" rel="noopener" target="_blank">LinkedIn</a></li>
          <li><a href="${esc(L.github)}" rel="noopener" target="_blank">GitHub</a></li>
          <li><a href="${esc(L.company)}" rel="noopener" target="_blank">Autoploy</a></li>
          ${L.resume ? `<li><a href="${esc(L.resume)}" target="_blank">CV (PDF)</a></li>` : ''}
        </ul>
      </div>
      <div class="wrap"><div class="footer-base"><span>© ${new Date().getFullYear()} ${esc(S.name)}</span><span>${esc(S.location)}</span></div></div>`;
  }

  // ---- Work page -----------------------------------------------------------
  function videoHTML(v = S.introVideo || {}, { placeholder = true } = {}) {
    // '16 / 9' -> 1.778. The CSS sizes the frame from this so the start of the
    // projects stays visible under the video on first load.
    const [aw, ah] = String(v.aspect || '16 / 9').split('/').map(Number);
    const ratio = aw > 0 && ah > 0 ? aw / ah : 16 / 9;
    const style = `style="--ar:${ratio.toFixed(4)}"`;
    let inner;
    if (v.youtube) {
      inner = `<iframe src="https://www.youtube-nocookie.com/embed/${esc(v.youtube)}?rel=0&modestbranding=1" title="Intro video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    } else if (v.src) {
      inner = `<video controls playsinline preload="metadata" ${v.poster ? `poster="${esc(v.poster)}"` : ''}><source src="${esc(v.src)}"></video>`;
    } else if (placeholder) {
      inner = `<div class="video-empty"><span class="play" aria-hidden="true"></span><span>Video coming soon</span></div>`;
    } else {
      return '';
    }
    return `<figure class="video${ratio < 1 ? ' video-tall' : ''}"><div class="video-frame" ${style}>${inner}</div></figure>`;
  }

  function renderWork() {
    // The first screen is the video and nothing else.
    $('#hero').innerHTML = videoHTML();
    const note = $('#work-note');
    if (note && S.hero.paidNote) note.textContent = S.hero.paidNote;

    const list = $('#projects');
    list.innerHTML = S.projects.map(rowHTML).join('');

    // ---- Filters
    const used = new Set(S.projects.map((p) => p.category));
    const cats = [{ id: 'all', label: 'All' }, ...S.categories.filter((c) => used.has(c.id))];
    const filters = $('#filters');
    filters.hidden = cats.length < 3; // one category isn't worth a filter
    filters.innerHTML = cats
      .map((c) => {
        const n = c.id === 'all' ? S.projects.length : S.projects.filter((p) => p.category === c.id).length;
        return `<button type="button" class="filter" data-filter="${c.id}" aria-pressed="${c.id === 'all'}">${esc(c.label)} <span>${n}</span></button>`;
      })
      .join('');

    const rows = () => [...list.children];
    const number = () => {
      let n = 0;
      rows().forEach((li) => {
        if (!li.hidden) li.querySelector('.proj-num').textContent = String(++n).padStart(2, '0');
      });
    };
    const applyFilter = (cat) => {
      filters.querySelectorAll('.filter').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
      let closed = false;
      rows().forEach((li) => {
        li.hidden = cat !== 'all' && li.dataset.cat !== cat;
        if (li.hidden && li.classList.contains('open')) {
          setOpen(li, false);
          closed = true;
        }
      });
      if (closed) clearHash();
      number();
    };
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('[data-filter]');
      if (b) applyFilter(b.dataset.filter);
    });

    // ---- Expand / collapse (one project open at a time)
    function setOpen(li, open) {
      if (!li.querySelector('.proj-panel')) return; // page projects don't expand
      li.classList.toggle('open', open);
      li.querySelector('.proj-toggle').setAttribute('aria-expanded', String(open));
      li.querySelector('.proj-panel').inert = !open;
    }
    const clearHash = () => history.replaceState(null, '', location.pathname + location.search);

    function toggle(li, { scroll = false } = {}) {
      const opening = !li.classList.contains('open');
      // Close the others instantly and hold the clicked row still, so the
      // page doesn't jump when a tall open project above it collapses.
      const before = li.getBoundingClientRect().top;
      rows().forEach((o) => {
        if (o !== li && o.classList.contains('open')) {
          o.classList.add('instant');
          setOpen(o, false);
        }
      });
      const shift = li.getBoundingClientRect().top - before;
      if (shift) window.scrollBy({ top: shift, behavior: 'instant' });
      requestAnimationFrame(() => rows().forEach((o) => o.classList.remove('instant')));

      if (scroll) li.classList.add('instant'); // full height now, so the scroll lands
      setOpen(li, opening);
      if (opening) history.replaceState(null, '', `#${li.id}`);
      else clearHash();
      if (scroll) li.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    list.addEventListener('click', (e) => {
      const b = e.target.closest('button.proj-toggle');
      if (b) toggle(b.closest('.proj'));
    });

    // Deep links: /#foreclosure-crm opens that project, so one can be shared directly.
    const fromHash = () => {
      let id;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      const li = id && document.getElementById(id);
      if (!li || !li.classList.contains('proj')) return;
      if (li.classList.contains('proj-page')) return navigate(`/projects/${li.id}`, { replace: true });
      applyFilter('all');
      if (!li.classList.contains('open')) toggle(li, { scroll: true });
    };
    window.addEventListener('hashchange', () => {
      if ($('#view-home').hidden) return;
      if (!location.hash) return rows().forEach((o) => o.classList.contains('open') && setOpen(o, false));
      fromHash();
    });

    number();
    fromHash();
  }

  // ---- Project page (/projects/<id>) ---------------------------------------
  function renderProject(id) {
    const main = $('#view-project');
    const pages = S.projects.filter((x) => x.page);
    const p = pages.find((x) => x.id === id);
    if (!p) {
      main.innerHTML = `<p class="eyebrow">Not found</p><h1 class="display">That project isn't here.</h1><p><a class="button" href="/">See my projects</a></p>`;
      return null;
    }
    const at = pages.indexOf(p);
    const next = pages[(at + 1) % pages.length];
    const [clientName, ...clientRest] = String(p.client || '').split(' · ');

    const facts = [
      ['Client', esc(p.client)],
      p.role ? ['My role', esc(p.role)] : null,
      ['Status', `<span class="status" data-status="${esc((p.status || '').toLowerCase())}">${esc(p.status)}</span>`],
      ['Year', esc(p.year)],
    ].filter(Boolean);

    const images = imagesOf(p);
    const video = videoHTML(p.video || {}, { placeholder: false });
    // Main visual: the project's video, else its first image, else its diagram.
    const media = video || coverHTML(p);
    const gallery = video ? images : images.slice(1);
    // The header shows the tagline, or the summary when there's no tagline;
    // either way the summary paragraph appears once.
    const sections = p.sections && p.sections.length
      ? p.sections
      : [{ heading: 'What I built', body: p.tagline ? p.summary : '', bullets: p.highlights || [] }];
    const links = (p.links || [])
      .map((l) => `<a class="button button-ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} <span aria-hidden="true">↗</span></a>`)
      .join('');

    main.innerHTML = `
      <a class="pp-back" href="/#work" data-back><span aria-hidden="true">←</span> All projects</a>

      <header class="pp-head">
        <p class="pp-client"><strong>${esc(clientName)}</strong>${clientRest.length ? ` · ${esc(clientRest.join(' · '))}` : ''}</p>
        <h1 class="pp-title">${esc(p.title)}</h1>
        <p class="pp-tagline">${esc(p.tagline || p.summary)}</p>
      </header>

      <div class="pp-media">${media}</div>

      <dl class="pp-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>

      ${p.stats && p.stats.length ? `<dl class="pp-stats">${p.stats.map((s) => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}</dl>` : ''}

      <div class="pp-body">
        <article class="pp-article">
          ${p.sections && p.sections.length && p.tagline ? `<section class="pp-section"><h2>Overview</h2><p>${esc(p.summary)}</p></section>` : ''}
          ${sections
            .map(
              (sec) => `
            <section class="pp-section">
              <h2>${esc(sec.heading)}</h2>
              ${sec.body ? `<p>${esc(sec.body)}</p>` : ''}
              ${sec.bullets && sec.bullets.length ? `<ul class="highlights">${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
            </section>`
            )
            .join('')}
        </article>
        <aside class="pp-aside">
          ${p.sections && p.sections.length && p.highlights && p.highlights.length ? `<div><p class="proj-label">At a glance</p><ul class="highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></div>` : ''}
          ${p.stack && p.stack.length ? `<div><p class="proj-label">Stack</p><ul class="tags">${p.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
          ${links ? `<div class="proj-links">${links}</div>` : ''}
        </aside>
      </div>

      ${gallery.length ? `<section class="pp-gallery" aria-label="Screens and photos">${gallery.map((img) => shotHTML(img)).join('')}</section>` : ''}

      ${next && next !== p ? `<a class="pp-next" href="/projects/${esc(next.id)}"><span class="proj-label">Next project</span><span class="pp-next-title">${esc(next.title)} <span aria-hidden="true">→</span></span><span class="pp-next-client">${esc(shortClient(next.client))}</span></a>` : ''}`;
    return p;
  }

  // ---- Router -------------------------------------------------------------
  // Home and project pages live in one document, so the music keeps playing
  // when someone opens a project. Real URLs still work for sharing and reloads.
  const PROJECT_PATH = /^\/projects\/([a-z0-9-]+)\/?$/;

  function pauseIntroVideo() {
    const v = $('#hero video');
    if (v) v.pause();
    const f = $('#hero iframe');
    if (f) f.src = f.src; // reloading the embed is the only way to stop it
  }

  function route({ restoreScroll } = {}) {
    const home = $('#view-home');
    const view = $('#view-project');
    const m = PROJECT_PATH.exec(location.pathname);
    if (m) {
      if (!home.hidden) pauseIntroVideo();
      const p = renderProject(m[1]);
      home.hidden = true;
      view.hidden = false;
      document.title = p ? `${p.title} · ${S.name}` : `Not found · ${S.name}`;
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      view.hidden = true;
      view.innerHTML = '';
      home.hidden = false;
      document.title = `${S.name} · Projects & Work`;
      if (restoreScroll != null) window.scrollTo({ top: restoreScroll, behavior: 'instant' });
    }
  }

  function navigate(url, { replace = false } = {}) {
    const leavingHome = !$('#view-home').hidden;
    // Remember where the visitor was on the list, for the back button.
    if (leavingHome && !replace) history.replaceState({ ...(history.state || {}), scrollY: window.scrollY }, '');
    history[replace ? 'replaceState' : 'pushState']({ fromHome: leavingHome }, '', url);
    route();
    const hash = url.split('#')[1];
    if (hash && $('#view-project').hidden) {
      const target = document.getElementById(hash);
      if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  function setupRouter() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      const toProject = PROJECT_PATH.test(url.pathname);
      const toHome = url.pathname === '/' && !$('#view-project').hidden;
      if (!toProject && !toHome) return;
      e.preventDefault();
      // "All projects" goes back to the exact spot on the list when it can.
      if (a.hasAttribute('data-back') && history.state && history.state.fromHome) return history.back();
      navigate(url.pathname + url.hash);
    });
    window.addEventListener('popstate', () => route({ restoreScroll: (history.state && history.state.scrollY) || 0 }));
  }

  // ---- Background dust ----------------------------------------------------
  // Fine specks drifting along two slow arcs, plus a faint scatter that
  // twinkles. Kept very light so it never competes with the content.
  function setupDust() {
    const canvas = $('#dust');
    if (!canvas || !canvas.getContext) return;
    const g = canvas.getContext('2d');
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Each stream is an arc: centre (as a fraction of the viewport), radius and thickness.
    const STREAMS = [
      { cx: 0.82, cy: -0.28, r: 0.62, spread: 0.06, dir: 1 },
      { cx: 0.05, cy: 1.3, r: 0.7, spread: 0.07, dir: -1 },
    ];
    let W = 0, H = 0, parts = [], last = 0, raf = 0;

    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    function seed() {
      const area = W * H;
      const perStream = Math.min(1300, Math.round(area / 1000));
      parts = [];
      STREAMS.forEach((st, si) => {
        for (let i = 0; i < perStream; i++) {
          parts.push({
            s: si,
            a: Math.random() * Math.PI * 2,
            off: gauss() * st.spread,
            speed: (0.00006 + Math.random() * 0.00014) * st.dir,
            size: 0.7 + Math.random() * 0.9,
            alpha: 0.07 + Math.random() * 0.26,
            tw: 0.4 + Math.random() * 1.6,
            ph: Math.random() * 6.28,
            hot: Math.random() < 0.025,
          });
        }
      });
      const scatter = Math.min(160, Math.round(area / 9000));
      for (let i = 0; i < scatter; i++) {
        parts.push({ s: -1, x: Math.random(), y: Math.random(), vy: -(0.000004 + Math.random() * 0.00001), size: 0.5 + Math.random() * 0.7, alpha: 0.04 + Math.random() * 0.12, tw: 0.3 + Math.random(), ph: Math.random() * 6.28, hot: false });
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(performance.now(), 0);
    }

    function draw(t, dt) {
      g.clearRect(0, 0, W, H);
      const scale = Math.max(W, H);
      for (const p of parts) {
        let x, y;
        if (p.s >= 0) {
          const st = STREAMS[p.s];
          p.a += p.speed * dt;
          const r = (st.r + p.off + Math.sin(p.a * 3 + p.ph) * 0.01) * scale;
          x = st.cx * W + Math.cos(p.a) * r;
          y = st.cy * H + Math.sin(p.a) * r;
        } else {
          p.y += p.vy * dt;
          if (p.y < -0.02) p.y = 1.02;
          x = p.x * W;
          y = p.y * H;
        }
        if (x < -2 || y < -2 || x > W + 2 || y > H + 2) continue;
        g.globalAlpha = p.alpha * (0.55 + 0.45 * Math.sin(t * 0.001 * p.tw + p.ph));
        g.fillStyle = p.hot ? '#d6452a' : '#1a1a18';
        g.fillRect(x, y, p.size, p.size);
      }
      g.globalAlpha = 1;
    }

    function frame(t) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(t - last, 100);
      if (dt < 33) return; // ~30fps is plenty for drifting dust
      last = t;
      draw(t, dt);
    }

    resize();
    window.addEventListener('resize', resize);
    if (still) return;
    raf = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
  }

  // ---- Radio ---------------------------------------------------------------
  // A small record in the top right. Nothing plays until it's clicked
  // (browsers block sound without a click anyway). Plays introStart→loopEnd
  // once, then loops loopStart→loopEnd with no gap, for as long as the tab is open.
  function setupRadio() {
    const M = S.music || {};
    const slot = $('#radio');
    if (!slot || !M.src) return;
    const title = M.title || 'Music';

    // Only show the button once the track actually exists on the server.
    fetch(M.src, { method: 'HEAD' })
      .then((r) => {
        if (!r.ok) return;
        document.body.classList.add('has-radio');
        slot.innerHTML = `
          <button type="button" class="radio" aria-pressed="false" aria-label="Play music: ${esc(title)}">
            <span class="radio-label">${esc(title)}</span>
            <span class="radio-disc" aria-hidden="true"></span>
          </button>`;
        wire(slot.querySelector('.radio'));
      })
      .catch(() => {});

    function wire(btn) {
      const VOLUME = M.volume ?? 0.35;
      let ctx, gain, buffer, source;
      let playing = false;

      const set = (state) => {
        btn.dataset.state = state;
        btn.setAttribute('aria-pressed', String(state === 'playing'));
        btn.setAttribute('aria-label', `${state === 'playing' ? 'Pause' : 'Play'} music: ${title}`);
      };
      const fadeTo = (v, secs) => {
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(v, now + secs);
      };

      async function play() {
        playing = true;
        if (!ctx) {
          // Let iPhones play it even with the silent switch on.
          if (navigator.audioSession) navigator.audioSession.type = 'playback';
          const AC = window.AudioContext || window.webkitAudioContext;
          ctx = new AC();
          gain = ctx.createGain();
          gain.gain.value = 0;
          gain.connect(ctx.destination);
        }
        const resumed = ctx.resume(); // must start inside the click
        if (!buffer) {
          set('loading');
          const data = await fetch(M.src).then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.arrayBuffer();
          });
          buffer = await new Promise((ok, fail) => ctx.decodeAudioData(data, ok, fail));
        }
        await resumed;
        if (!playing) return; // clicked again while loading
        if (!source) {
          const end = Math.min(M.loopEnd ?? buffer.duration, buffer.duration);
          source = ctx.createBufferSource();
          source.buffer = buffer;
          source.loop = true;
          source.loopStart = Math.min(M.loopStart ?? 0, end);
          source.loopEnd = end;
          source.connect(gain);
          source.start(0, Math.min(M.introStart ?? 0, end));
        }
        fadeTo(VOLUME, 1.2);
        set('playing');
      }

      function pause() {
        playing = false;
        set('paused');
        if (!ctx) return;
        fadeTo(0, 0.4);
        setTimeout(() => {
          if (!playing) ctx.suspend();
        }, 450);
      }

      btn.addEventListener('click', () => {
        if (playing) return pause();
        play().catch(() => {
          playing = false;
          set('error');
          btn.setAttribute('aria-label', 'Music unavailable');
        });
      });

      // Don't talk over the intro video.
      const intro = $('#hero video');
      if (intro) intro.addEventListener('play', () => playing && pause());
      set('paused');
    }
  }

  renderFooter();
  renderWork();
  setupRouter();
  route();
  setupDust();
  setupRadio();
})();
