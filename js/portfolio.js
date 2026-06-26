/* =====================================================================
   AMENITY — portfolio.js
   Filtro de projetos + autoplay de vídeos no hover
   ===================================================================== */

/* ── Filtros ─────────────────────────────────────────────────────── */
const btns  = document.querySelectorAll('.flt button');
const cards = document.querySelectorAll('.pgrid > [data-c]');

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('a'));
    btn.classList.add('a');
    const f = btn.dataset.f;
    cards.forEach(card => {
      const match = f === 'all' || card.dataset.c === f;
      if (match) {
        card.style.display = '';
        requestAnimationFrame(() => {
          card.style.opacity   = '1';
          card.style.transform = 'none';
        });
      } else {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => { card.style.display = 'none'; }, 280);
      }
    });
  });
});

/* ── Autoplay de vídeos no hover ────────────────────────────────── */
document.querySelectorAll('.pcard-vid video').forEach(video => {
  const card = video.closest('.pcard');
  card.addEventListener('mouseenter', () => { video.play().catch(() => {}); });
  card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});
