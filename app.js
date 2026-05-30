// Neelam Ayur Sansthan — shared interactions
document.addEventListener('DOMContentLoaded', function () {
  // year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // sticky nav shadow
  var header = document.getElementById('header');
  if (header) addEventListener('scroll', function () {
    header.classList.toggle('scrolled', scrollY > 20);
  });

  // mobile menu toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.links');
  if (toggle && links) toggle.addEventListener('click', function () {
    links.classList.toggle('open');
  });

  // scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // escape closes modal
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
});

// order modal
function openModal(product) {
  var modal = document.getElementById('modal');
  if (!modal) return;
  var t = document.getElementById('modal-title');
  var p = document.getElementById('modal-text');
  if (product) {
    if (t) t.textContent = 'Order ' + product;
    if (p) p.textContent = 'To order ' + product + ', reach out directly — we’ll confirm freshness, quantity and delivery for you.';
  } else {
    if (t) t.textContent = 'Order with us';
    if (p) p.textContent = 'To place your order, reach out directly — we’ll confirm freshness, quantity and delivery for you.';
  }
  modal.classList.add('open');
}
function closeModal() {
  var modal = document.getElementById('modal');
  if (modal) modal.classList.remove('open');
}

// enquiry form
function submitForm(e) {
  e.preventDefault();
  var btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '✓ Enquiry Sent — We’ll be in touch!';
  btn.style.background = 'var(--green-700)';
  setTimeout(function () { e.target.reset(); btn.textContent = 'Send Enquiry'; btn.style.background = ''; }, 3200);
}
