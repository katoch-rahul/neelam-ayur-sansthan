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

// enquiry form — delivers the enquiry to WhatsApp with all fields pre-filled
var BIZ_WHATSAPP = '918968661284'; // Neelam Ayur Sansthan — country code + number, no symbols

function submitForm(e) {
  e.preventDefault();
  var form = e.target;
  var btn = form.querySelector('button[type=submit]');
  var original = btn ? btn.textContent : 'Send Enquiry';

  // Gather each filled field as "Label: value"
  var lines = [];
  Array.prototype.forEach.call(form.elements, function (el) {
    if (!el.name || el.type === 'submit' || el.type === 'button') return;
    var val = (el.value || '').trim();
    if (!val) return;
    var field = el.closest ? el.closest('.field') : null;
    var lab = field ? field.querySelector('label') : null;
    var label = lab ? lab.textContent.replace(/\s*\(optional\)\s*/i, '').trim() : el.name;
    lines.push(label + ': ' + val);
  });

  var message = 'Hello Neelam Ayur Sansthan 🌿\nI would like to get in touch.\n\n' + lines.join('\n');
  var url = 'https://wa.me/' + BIZ_WHATSAPP + '?text=' + encodeURIComponent(message);

  // Open WhatsApp (synchronously, inside the user gesture, so it isn't blocked)
  window.open(url, '_blank', 'noopener');

  if (btn) {
    btn.textContent = '✓ Opening WhatsApp…';
    btn.style.background = 'var(--green-700)';
    setTimeout(function () { form.reset(); btn.textContent = original; btn.style.background = ''; }, 3200);
  }
}
