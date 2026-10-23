/* Ahmad Raza Portfolio — menu, product modal, demo preselect, inquiry form, reveal */
(function () {
  'use strict';

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  function closeMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); closeModal(); }
  });

  /* ---------- product details modal ---------- */
  var PRODUCTS = {
    shop: {
      name: 'Shop POS', target: 'For retail shops & general stores',
      badge: 'Ready', badgeClass: 'badge-ready', price: 'PKR 35,000', per: 'one-time',
      desc: 'Complete billing and stock system for retail shops — fast checkout, inventory and khata in one offline app.',
      features: ['Fast barcode billing with receipts', 'Inventory with low-stock alerts', 'Khata (credit) customer accounts', 'Daily / monthly sales reports', '100% offline with auto-backup', 'License-key protected, one PC per license']
    },
    resto: {
      name: 'RestoPOS', target: 'For restaurants & cafes',
      badge: 'In development', badgeClass: 'badge-dev', price: 'PKR 50,000+', per: 'one-time',
      desc: 'Restaurant management with table billing, kitchen order tickets and delivery tracking. Early version running; full release in development.',
      features: ['Table & floor-view management', 'KOT (kitchen order tickets)', 'Dine-in, takeaway & delivery modes', 'Waiter management & staff roles', 'Menu management with categories', 'License-key protected, LAN multi-PC support planned']
    },
    garments: {
      name: 'Garments POS', target: 'For garment & clothing retailers',
      badge: 'In development', badgeClass: 'badge-dev', price: 'Contact for pricing', per: '',
      desc: 'POS built for clothing stores — size and color-wise stock, barcode billing and khata. Product and purchase modules done; billing module next.',
      features: ['Size / color variant-wise stock', 'Barcode billing', 'Purchase & supplier management', 'Khata (credit) accounts', 'Stock, purchase & low-stock reports', '100% offline with auto-backup']
    },
    estate: {
      name: 'Estate Manager', target: 'For property dealers',
      badge: 'Ready', badgeClass: 'badge-ready', price: 'Contact for pricing', per: '',
      desc: 'Manage property listings, deals, installments and rental collection in one offline desktop app.',
      features: ['Property listings (plot / house / shop)', 'Client records with CNIC', 'Installment (qist) schedules & tracking', 'Rental monthly collection', 'Deals, bayana & commission', 'Reports with CSV export, auto-backup']
    }
  };

  var modal = document.getElementById('productModal');
  var mBadge = document.getElementById('modalBadge');
  var mTitle = document.getElementById('modalTitle');
  var mTarget = document.getElementById('modalTarget');
  var mDesc = document.getElementById('modalDesc');
  var mFeat = document.getElementById('modalFeat');
  var mPrice = document.getElementById('modalPrice');
  var mDemo = document.getElementById('modalDemo');
  var lastFocus = null;

  function openModal(key) {
    var p = PRODUCTS[key];
    if (!p) return;
    lastFocus = document.activeElement;
    mBadge.textContent = p.badge;
    mBadge.className = 'badge ' + p.badgeClass;
    mTitle.textContent = p.name;
    mTarget.textContent = p.target;
    mDesc.textContent = p.desc;
    mFeat.innerHTML = '';
    p.features.forEach(function (f) {
      var li = document.createElement('li');
      li.textContent = f;
      mFeat.appendChild(li);
    });
    mPrice.innerHTML = '';
    mPrice.appendChild(document.createTextNode(p.price + ' '));
    if (p.per) {
      var s = document.createElement('span');
      s.textContent = p.per;
      mPrice.appendChild(s);
    }
    mDemo.setAttribute('data-demo', p.name);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var d = e.target.closest('[data-details]');
    if (d) { openModal(d.getAttribute('data-details')); return; }
    if (e.target.closest('[data-close]')) closeModal();
  });

  /* ---------- "Request a Demo" preselects the software in the form ---------- */
  var softwareSelect = document.getElementById('fSoftware');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-demo]');
    if (!a) return;
    var want = a.getAttribute('data-demo');
    if (!want) return;
    for (var i = 0; i < softwareSelect.options.length; i++) {
      if (softwareSelect.options[i].text === want) {
        softwareSelect.selectedIndex = i;
        break;
      }
    }
    closeModal();
  });

  /* ---------- inquiry form: validate, then open email with prefilled inquiry ---------- */
  var form = document.getElementById('inquiryForm');
  var errBox = document.getElementById('formError');
  var EMAIL = 'ahmadraza.eccountant@gmail.com';
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('fName').value.trim();
    var contact = document.getElementById('fContact').value.trim();
    var business = document.getElementById('fBusiness').value;
    var software = softwareSelect.value;
    var msg = document.getElementById('fMsg').value.trim();

    var problems = [];
    if (!name) problems.push('your name');
    if (!contact) problems.push('email or phone');
    else if (contact.indexOf('@') > -1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) problems.push('a valid email address');
    if (!business) problems.push('business type');
    if (!software) problems.push('required software');

    if (problems.length) {
      errBox.textContent = 'Please provide ' + problems.join(', ') + '.';
      errBox.hidden = false;
      return;
    }
    errBox.hidden = true;

    var subject = 'Demo request — ' + software + ' (' + business + ')';
    var body = 'Name: ' + name + '\nContact: ' + contact + '\nBusiness type: ' + business +
      '\nSoftware: ' + software + '\n\nRequirements:\n' + (msg || '(not specified)');
    window.location.href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });

  /* ---------- subtle reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.hero-copy > *, .hero-visual, .section-title, .section-sub, .card, .service, .yt-strip, .about-grid > *, .contact-grid > *')
    .forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
})();
