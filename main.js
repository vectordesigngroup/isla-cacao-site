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
