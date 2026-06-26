/* =====================================================================
   AMENITY — main.js v2
   ===================================================================== */

/* ── Nav scroll ──────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
if (nav) {
  const heroEl = document.querySelector('header.hero');
  const updateNav = () => {
    const scrolled = window.scrollY > 20;
    nav.classList.toggle('s', scrolled);
    if (heroEl) {
      const heroH = heroEl.offsetHeight;
      nav.classList.toggle('dark-nav', window.scrollY < heroH - 80);
    }
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* ── Reveal on scroll ────────────────────────────────────────────── */
const allReveal = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
    { threshold: 0.12 }
  );
  allReveal.forEach(el => obs.observe(el));
} else {
  allReveal.forEach(el => el.classList.add('in'));
}

/* ── Hamburger menu ──────────────────────────────────────────────── */
const hbg = document.getElementById('hbg');
const mob = document.getElementById('mob');
if (hbg && mob) {
  hbg.addEventListener('click', () => {
    const open = mob.classList.toggle('open');
    hbg.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mob.classList.remove('open');
    hbg.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ── Stats counter-up ────────────────────────────────────────────── */
function animateCount(el) {
  const raw    = el.dataset.target || el.textContent.replace(/\D/g,'');
  const target = parseInt(raw, 10);
  if (isNaN(target)) return;
  const suffix = el.dataset.suffix || '';
  const dur    = 1400;
  const start  = performance.now();
  const tick   = (now) => {
    const p    = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString('pt-BR') + suffix;
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      const parent = el.closest('.stat-number');
      if (parent) {
        parent.classList.add('done');
        setTimeout(() => parent.classList.remove('done'), 900);
      }
    }
  };
  requestAnimationFrame(tick);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-number [data-target]').forEach(animateCount);
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stats-grid').forEach(el => statsObs.observe(el));

/* ── Lightbox ────────────────────────────────────────────────────── */
(function() {
  const overlay = document.createElement('div');
  overlay.className = 'lb';
  overlay.innerHTML = `
    <button class="lb-close" aria-label="Fechar">✕</button>
    <button class="lb-prev" aria-label="Anterior">←</button>
    <button class="lb-next" aria-label="Próximo">→</button>
    <div class="lb-content"></div>
    <div class="lb-caption"><span class="lbc-cat"></span><span class="lbc-name"></span></div>
    <div class="lb-counter"></div>`;
  document.body.appendChild(overlay);

  let items = [], current = 0;

  function collect() {
    items = [...document.querySelectorAll('[data-lb]')];
    items.forEach((el, i) => {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', e => { e.preventDefault(); open(i); });
    });
  }

  function show() {
    const el   = items[current];
    const cont = overlay.querySelector('.lb-content');
    cont.innerHTML = '';

    if (el.tagName === 'IMG' || el.dataset.lb === 'photo') {
      const img = document.createElement('img');
      img.src = el.src || el.dataset.src;
      img.alt = el.alt || '';
      cont.appendChild(img);
    } else if (el.dataset.lb === 'video') {
      const v = document.createElement('video');
      const src = el.querySelector('source')
        ? el.querySelector('source').getAttribute('src')
        : el.dataset.src;
      v.src = src;
      v.controls = true; v.autoplay = true; v.style.maxWidth = '90vw'; v.style.maxHeight = '85vh';
      cont.appendChild(v);
    }

    const cat  = el.dataset.cat  || '';
    const name = el.dataset.name || '';
    overlay.querySelector('.lbc-cat').textContent  = cat;
    overlay.querySelector('.lbc-name').textContent = name;
    overlay.querySelector('.lb-counter').textContent = `${current + 1} / ${items.length}`;
    overlay.querySelector('.lb-prev').style.display = current > 0 ? '' : 'none';
    overlay.querySelector('.lb-next').style.display = current < items.length - 1 ? '' : 'none';
  }

  function open(i) {
    current = i; show();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    overlay.querySelector('.lb-content').innerHTML = '';
  }

  overlay.querySelector('.lb-close').onclick = close;
  overlay.querySelector('.lb-prev').onclick  = () => { current = Math.max(0, current - 1); show(); };
  overlay.querySelector('.lb-next').onclick  = () => { current = Math.min(items.length - 1, current + 1); show(); };
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  { current = Math.max(0, current - 1); show(); }
    if (e.key === 'ArrowRight') { current = Math.min(items.length - 1, current + 1); show(); }
  });

  // Touch swipe
  let tx = 0;
  overlay.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive:true });
  overlay.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 60) {
      if (dx < 0) { current = Math.min(items.length - 1, current + 1); show(); }
      else        { current = Math.max(0, current - 1); show(); }
    }
  });

  document.addEventListener('DOMContentLoaded', collect);
  setTimeout(collect, 200);
})();

/* ── Back to top ─────────────────────────────────────────────────── */
const btt = document.getElementById('btt');
if (btt) {
  window.addEventListener('scroll', () => btt.classList.toggle('vis', window.scrollY > 600), { passive:true });
  btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

/* ── Vídeos de preview ficam sempre mudos ────────────────────────── */
document.querySelectorAll('.masonry-vid video, .pcard-vid video, .collage-item video').forEach(v => {
  v.muted = true; v.volume = 0;
});


