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
