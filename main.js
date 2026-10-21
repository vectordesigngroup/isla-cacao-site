// Forms are front-end only: no data is sent or stored.
// TODO: connect to a real form backend and add a contact email.
document.querySelectorAll('[data-form]').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    form.querySelectorAll('input,select,textarea,button').forEach(function (el) { el.disabled = true; });
    var ok = form.querySelector('.success');
    if (ok) ok.hidden = false;
  });
});
document.querySelectorAll('[data-topic]').forEach(function (a) {
  a.addEventListener('click', function () {
    var s = document.getElementById('topic'); if (s) s.value = a.dataset.topic;
  });
});
var btn = document.querySelector('.menu-btn'), links = document.querySelector('.links');
btn.addEventListener('click', function () {
  var open = links.classList.toggle('open'); btn.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { links.classList.remove('open'); }); });
var nav = document.querySelector('.nav');
window.addEventListener('scroll', function () { nav.classList.toggle('solid', window.scrollY > 40); });
document.getElementById('yr').textContent = new Date().getFullYear();

// Gallery lightbox
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.g-open'));
  var lb = document.getElementById('lightbox'); if (!lb || !items.length) return;
  var img = document.getElementById('lb-img'), webp = document.getElementById('lb-webp'), cap = document.getElementById('lb-cap');
  var idx = 0, last = null;
  function show(i) {
    idx = (i + items.length) % items.length;
    var b = items[idx], base = b.dataset.full, fc = b.parentNode.querySelector('figcaption');
    webp.srcset = base + '.webp'; img.src = base + '.jpg'; img.alt = b.querySelector('img').alt;
    cap.textContent = fc.firstChild.textContent.trim() + ' · Packaging concept, not a final product';
  }
  function open(i) { last = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); }
  function close() { lb.hidden = true; document.body.style.overflow = ''; if (last) last.focus(); }
  items.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(idx - 1); else if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

// Gallery carousel
(function () {
  var root = document.querySelector('.carousel'); if (!root) return;
  var track = root.querySelector('.c-track'), slides = root.querySelectorAll('.c-slide'), dots = root.querySelectorAll('.c-dot');
  var vp = root.querySelector('.c-viewport'), n = slides.length, i = 0, timer = null, paused = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches, DELAY = 5500;
  function go(k) {
    i = (k + n) % n; track.style.transform = 'translateX(' + (-100 * i) + '%)';
    dots.forEach(function (d, j) { d.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
    slides.forEach(function (s, j) { s.setAttribute('aria-hidden', j === i ? 'false' : 'true'); s.querySelector('.g-open').tabIndex = j === i ? 0 : -1; });
  }
  function start() { stop(); if (!reduce && !paused && !document.hidden) timer = setInterval(function () { go(i + 1); }, DELAY); }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function pause() { paused = true; stop(); }
  function resume() { paused = false; start(); }
  root.querySelector('.c-prev').addEventListener('click', function () { go(i - 1); start(); });
  root.querySelector('.c-next').addEventListener('click', function () { go(i + 1); start(); });
  dots.forEach(function (d, j) { d.addEventListener('click', function () { go(j); start(); }); });
  root.addEventListener('keydown', function (e) {
    var lb = document.getElementById('lightbox'); if (lb && !lb.hidden) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); } else if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
  });
  root.addEventListener('mouseenter', pause); root.addEventListener('mouseleave', resume);
  root.addEventListener('focusin', pause); root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) resume(); });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  // Swipe / drag
  var x0 = null, y0 = 0, dx = 0, moved = false, horiz = null;
  vp.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.c-arrow')) return;
    x0 = e.clientX; y0 = e.clientY; dx = 0; moved = false; horiz = null; pause();
  });
  vp.addEventListener('pointermove', function (e) {
    if (x0 === null) return;
    dx = e.clientX - x0; var dy = e.clientY - y0;
    if (horiz === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) horiz = Math.abs(dx) > Math.abs(dy);
    if (!horiz) return;
    moved = true; track.classList.add('dragging');
    track.style.transform = 'translateX(calc(' + (-100 * i) + '% + ' + dx + 'px))';
  });
  function end(e) {
    if (x0 === null) return;
    track.classList.remove('dragging');
    if (moved && Math.abs(dx) > vp.offsetWidth * 0.15) go(i + (dx < 0 ? 1 : -1)); else go(i);
    x0 = null;
    if (e.pointerType !== 'mouse') { setTimeout(resume, 4000); } // touch: pause, then resume gently
  }
  vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', function (e) { if (x0 !== null && e.pointerType === 'mouse') end(e); });
  // Suppress the lightbox click after a drag
  vp.addEventListener('click', function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  go(0); start();
})();
