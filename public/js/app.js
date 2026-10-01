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
    community(r) {
      let s = '';
      const cx = 200, cy = 125;
      s += `<circle cx="${cx}" cy="${cy}" r="88" class="ln faint"/><circle cx="${cx}" cy="${cy}" r="52" class="ln faint"/>`;
      for (let i = 0; i < 42; i++) {
        const a = r() * Math.PI * 2, d = 30 + Math.sqrt(r()) * 70;
        s += `<circle cx="${(cx + Math.cos(a) * d * 1.45).toFixed(1)}" cy="${(cy + Math.sin(a) * d * 0.95).toFixed(1)}" r="${(2.5 + r() * 3).toFixed(1)}" class="fill-ink" style="opacity:${(0.35 + r() * 0.6).toFixed(2)}"/>`;
      }
      s += `<circle cx="${cx}" cy="${cy}" r="22" class="halo"/><circle cx="${cx}" cy="${cy}" r="12" class="hot"/>`;
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

  function coverHTML(p, size) {
    if (p.image) {
      return `<div class="cover cover-image"><img src="${esc(p.image)}" alt="" loading="lazy"></div>`;
    }
    if (p.logo) {
      return `<div class="cover cover-logo" style="background:${esc(p.logoBg || 'var(--ink)')}"><img src="${esc(p.logo)}" alt="" loading="lazy"></div>`;
    }
    const draw = MOTIFS[p.cover] || MOTIFS.agents;
    return `<div class="cover cover-${size}" aria-hidden="true"><svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet">${draw(rng(p.id))}</svg></div>`;
  }

  const catLabel = (id) => (S.categories.find((c) => c.id === id) || {}).label || '';

  function cardHTML(p, size) {
    const tags = (p.stack || []).slice(0, size === 'lg' ? 4 : 3).map((t) => `<li>${esc(t)}</li>`).join('');
    return `
      <article class="card card-${size}">
        <button class="card-hit" type="button" data-open="${esc(p.id)}" aria-label="Open ${esc(p.title)}"></button>
        ${coverHTML(p, size)}
        <div class="card-body">
          <p class="meta"><span class="status" data-status="${esc((p.status || '').toLowerCase())}">${esc(p.status)}</span><span>${esc(p.client)}</span></p>
          <h3 class="card-title">${esc(p.title)}</h3>
          ${size === 'lg' ? `<p class="card-summary">${esc(p.summary)}</p>` : ''}
          <ul class="tags">${tags}</ul>
        </div>
      </article>`;
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
  function videoHTML() {
    const v = S.introVideo || {};
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
    } else {
      inner = `<div class="video-empty"><span class="play" aria-hidden="true"></span><span>Video coming soon</span></div>`;
    }
    return `<figure class="video${ratio < 1 ? ' video-tall' : ''}"><div class="video-frame" ${style}>${inner}</div></figure>`;
  }

  function renderWork() {
    const H = S.hero;
    $('#hero').innerHTML = `
      ${videoHTML()}
      <div class="hero-copy">
        <h1 class="hero-name">${esc(S.name)}</h1>
        <p class="hero-line">${esc(H.line)}</p>
        <p class="lede">${esc(H.lede)}</p>
      </div>`;
    const note = $('#featured-note');
    if (note && H.paidNote) note.textContent = H.paidNote;

    const featured = S.projects.filter((p) => p.featured);
    $('#featured').innerHTML = featured.map((p) => cardHTML(p, 'lg')).join('');

    // The grid holds everything not already shown above, so nothing appears twice.
    const rest = S.projects.filter((p) => !p.featured);
    const used = new Set(rest.map((p) => p.category));
    const cats = [{ id: 'all', label: 'All' }, ...S.categories.filter((c) => used.has(c.id))];
    const filters = $('#filters');
    // One category isn't worth a filter row.
    filters.hidden = cats.length < 3;
    filters.innerHTML = cats
      .map((c) => {
        const n = c.id === 'all' ? rest.length : rest.filter((p) => p.category === c.id).length;
        return `<button type="button" class="chip" data-filter="${c.id}" aria-pressed="${c.id === 'all'}">${esc(c.label)} <span>${n}</span></button>`;
      })
      .join('');

    const grid = $('#grid');
    const drawGrid = (cat) => {
      const list = cat === 'all' ? rest : rest.filter((p) => p.category === cat);
      grid.innerHTML = list.map((p) => cardHTML(p, 'sm')).join('');
    };
    drawGrid('all');
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('[data-filter]');
      if (!b) return;
      filters.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
      drawGrid(b.dataset.filter);
    });

    setupDialog();
  }

  function setupDialog() {
    const dlg = $('#project-dialog');
    let lastFocus = null;
    let pushed = false;

    const open = (id, push = true) => {
      const p = S.projects.find((x) => x.id === id);
      if (!p) return;
      if (!dlg.open) lastFocus = document.activeElement;
      const links = (p.links || [])
        .map((l) => `<a class="button" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} <span aria-hidden="true">↗</span></a>`)
        .join('');
      dlg.innerHTML = `
        <div class="dialog-inner">
          <button class="dialog-close" type="button" aria-label="Close">×</button>
          ${coverHTML(p, 'lg')}
          <div class="dialog-body">
            <p class="meta"><span class="status" data-status="${esc((p.status || '').toLowerCase())}">${esc(p.status)}</span><span>${esc(catLabel(p.category))}</span><span>${esc(p.year)}</span></p>
            <h2 id="dialog-title" class="dialog-title">${esc(p.title)}</h2>
            <p class="dialog-client">${esc(p.client)}${p.role ? ` · <span>${esc(p.role)}</span>` : ''}</p>
            <p class="dialog-summary">${esc(p.summary)}</p>
            ${p.highlights && p.highlights.length ? `<ul class="highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
            ${p.stack && p.stack.length ? `<ul class="tags">${p.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
            ${links ? `<div class="dialog-links">${links}</div>` : ''}
          </div>
        </div>`;
      if (!dlg.open) dlg.showModal();
      document.documentElement.classList.add('modal-open');
      $('.dialog-close', dlg).focus();
      pushed = push && location.hash !== `#${id}`;
      if (pushed) history.pushState(null, '', `#${id}`);
    };

    const close = () => {
      if (dlg.open) dlg.close();
    };

    dlg.addEventListener('close', () => {
      document.documentElement.classList.remove('modal-open');
      // Undo our own history entry; a deep-linked open just drops the hash.
      if (pushed) history.back();
      else if (location.hash) history.replaceState(null, '', location.pathname + location.search);
      pushed = false;
      if (lastFocus) lastFocus.focus();
    });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg || e.target.closest('.dialog-close')) close();
    });
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-open]');
      if (b) open(b.dataset.open);
    });

    // Deep links: /#plan-b opens that project, so you can share one directly.
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id && S.projects.some((p) => p.id === id)) return open(id, false);
      pushed = false; // the browser already left our entry; don't go back twice
      close();
    };
    window.addEventListener('popstate', fromHash);
    fromHash();
  }

  // ---- About page ----------------------------------------------------------
  function renderAbout() {
    const A = S.about;
    const L = S.links;
    const initials = S.name.split(' ').map((w) => w[0]).join('');
    $('#main').innerHTML = `
      <aside class="about-side">
        <div class="portrait">${A.photo ? `<img src="${esc(A.photo)}" alt="${esc(S.name)}">` : `<span aria-hidden="true">${esc(initials)}</span>`}</div>
        <dl class="facts">${A.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>
        <div class="side-actions">
          <a class="button" href="mailto:${esc(L.email)}">Email me</a>
          <a class="button button-ghost" href="${esc(L.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
          ${L.resume ? `<a class="button button-ghost" href="${esc(L.resume)}" target="_blank">CV (PDF)</a>` : ''}
        </div>
      </aside>

      <div class="about-main">
        <p class="eyebrow">${esc(S.role)}</p>
        <h1 class="display">Hi, I'm Jaiden.</h1>
        <div class="intro">${A.intro.map((p) => `<p>${esc(p)}</p>`).join('')}</div>

        <section class="about-section" aria-labelledby="exp">
          <h2 id="exp" class="section-title">Experience</h2>
          <ol class="timeline">
            ${A.experience
              .map(
                (e) => `
              <li>
                <div class="tl-head">
                  <h3>${esc(e.title)} <span class="at">· ${esc(e.org)}</span></h3>
                  <p class="tl-when">${esc(e.period)}</p>
                </div>
                <p class="tl-place">${esc(e.place)}</p>
                <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
              </li>`
              )
              .join('')}
          </ol>
          <p class="see-work"><a href="/">See the projects →</a></p>
        </section>

        <section class="about-section" aria-labelledby="act">
          <h2 id="act" class="section-title">Outside of work</h2>
          <div class="activities">
            ${A.activities.map((a) => `<div class="activity"><h3>${esc(a.title)}</h3><p>${esc(a.detail)}</p></div>`).join('')}
          </div>
        </section>

        <section class="about-section" aria-labelledby="edu">
          <h2 id="edu" class="section-title">Education</h2>
          <div class="tl-head"><h3>${esc(A.education.school)}</h3><p class="tl-when">${esc(A.education.period)}</p></div>
          <p class="muted">${esc(A.education.detail)}</p>
        </section>

        <section class="about-section" aria-labelledby="stk">
          <h2 id="stk" class="section-title">What I build with</h2>
          <dl class="stack">
            ${A.stack.map((g) => `<div><dt>${esc(g.group)}</dt><dd><ul class="tags">${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></dd></div>`).join('')}
          </dl>
        </section>
      </div>`;
  }

  renderFooter();
  const page = document.body.dataset.page;
  if (page === 'work') renderWork();
  if (page === 'about') renderAbout();
})();
