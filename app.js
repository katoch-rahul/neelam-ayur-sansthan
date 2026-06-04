// Neelam Ayur Sansthan — shared interactions

// Announcement bar — hide immediately if the visitor dismissed it earlier. Runs
// synchronously; this script sits at the end of <body>, so #topbar already exists.
try {
  if (localStorage.getItem('nas-topbar') === 'closed') {
    var dismissedBar = document.getElementById('topbar');
    if (dismissedBar) dismissedBar.style.display = 'none';
  }
} catch (e) {}

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

  // pre-type an opening message on any direct WhatsApp link (data-wa attribute)
  document.querySelectorAll('a[data-wa]').forEach(function (a) {
    a.href = waUrl(a.getAttribute('data-wa'));
  });

  // escape closes modal
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
});

// ---- WhatsApp helpers ----
var BIZ_WHATSAPP = '918968661284'; // country code + number, no symbols
var BIZ_EMAIL = 'neelamayursansthan@gmail.com';

// Build a wa.me link with an optional pre-typed opening message.
function waUrl(msg) {
  return 'https://wa.me/' + BIZ_WHATSAPP + (msg ? '?text=' + encodeURIComponent(msg) : '');
}

// Price/size reference so order messages can name the exact product.
var PRODUCT_INFO = {
  'Amla Juice': '₹249 · 500 ml',
  'Buransh Juice': '₹299 · 500 ml'
};

// order modal — tailors the title, text and the WhatsApp/email links to the product
function openModal(product) {
  var modal = document.getElementById('modal');
  if (!modal) return;
  var t = document.getElementById('modal-title');
  var p = document.getElementById('modal-text');
  var wa = document.getElementById('modal-wa');
  var em = document.getElementById('modal-email');
  var waMsg, subject;
  if (product) {
    var price = PRODUCT_INFO[product];
    if (t) t.textContent = 'Order ' + product;
    if (p) p.textContent = 'To order ' + product + ', reach out directly — we’ll confirm freshness, quantity and delivery for you.';
    waMsg = 'Hello Neelam Ayur Sansthan 🌿\nI’d like to order *' + product + '*' + (price ? ' (' + price + ')' : '') + '.\nCould you please share availability and delivery details?';
    subject = 'Order enquiry — ' + product;
  } else {
    if (t) t.textContent = 'Order with us';
    if (p) p.textContent = 'To place your order, reach out directly — we’ll confirm freshness, quantity and delivery for you.';
    waMsg = 'Hello Neelam Ayur Sansthan 🌿\nI’d like to place an order. Could you please tell me what’s available and how to order?';
    subject = 'Order enquiry';
  }
  if (wa) wa.href = waUrl(waMsg);
  if (em) em.href = 'mailto:' + BIZ_EMAIL + '?subject=' + encodeURIComponent(subject);
  modal.classList.add('open');
}
function closeModal() {
  var modal = document.getElementById('modal');
  if (modal) modal.classList.remove('open');
}

// Dismiss the announcement bar and remember it for this browser.
function closeTopbar() {
  var tb = document.getElementById('topbar');
  if (tb) tb.style.display = 'none';
  try { localStorage.setItem('nas-topbar', 'closed'); } catch (e) {}
}

// enquiry form — delivers the enquiry to WhatsApp with all fields pre-filled
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
  var url = waUrl(message);

  // Open WhatsApp (synchronously, inside the user gesture, so it isn't blocked)
  window.open(url, '_blank', 'noopener');

  if (btn) {
    btn.textContent = '✓ Opening WhatsApp…';
    btn.style.background = 'var(--green-700)';
    setTimeout(function () { form.reset(); btn.textContent = original; btn.style.background = ''; }, 3200);
  }
}
