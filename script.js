/* Ahmad Raza Portfolio — menu, product modal, demo preselect, inquiry form, reveal */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var customCursorEnabled = finePointer && !reduceMotion;
  if (customCursorEnabled) document.documentElement.classList.add('has-custom-cursor');

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

  /* ---------- scroll progress ---------- */
  var progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  function updateProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var y = window.scrollY || h.scrollTop || 0;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- custom cursor (desktop pointer only) ---------- */
  if (customCursorEnabled) {
    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    var ringX = mouseX, ringY = mouseY;
    window.addEventListener('pointermove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = 'translate3d(' + mouseX + 'px,' + mouseY + 'px,0) translate(-50%,-50%)';
      var interactive = e.target && e.target.closest ? e.target.closest('a,button,input,select,textarea,label,[data-demo],[data-details]') : null;
      document.body.classList.toggle('cursor-hover', !!interactive);
    }, { passive: true });
    window.addEventListener('pointerdown', function () { document.body.classList.add('cursor-down'); });
    window.addEventListener('pointerup', function () { document.body.classList.remove('cursor-down'); });
    (function animateCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = 'translate3d(' + ringX + 'px,' + ringY + 'px,0) translate(-50%,-50%)';
      window.requestAnimationFrame(animateCursor);
    })();
  }

  /* ---------- gentle 3D tilt ---------- */
  function addTilt(el, maxTilt) {
    if (!el || !customCursorEnabled) return;
    var raf = null, hovering = false;
    var rx = 0, ry = 0, tx = 0, ty = 0;
    function render() {
      rx += (tx - rx) * 0.13;
      ry += (ty - ry) * 0.13;
      el.style.transform = 'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)' + (hovering ? ' translateY(-4px)' : '');
      if (hovering || Math.abs(tx - rx) > 0.05 || Math.abs(ty - ry) > 0.05) {
        raf = window.requestAnimationFrame(render);
      } else {
        raf = null;
        el.style.transform = '';
        el.style.transition = '';
      }
    }
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (px * 100) + '%');
      el.style.setProperty('--my', (py * 100) + '%');
      tx = (0.5 - py) * maxTilt;
      ty = (px - 0.5) * maxTilt;
      hovering = true;
      el.style.transition = 'transform .12s ease-out, box-shadow .18s ease';
      if (!raf) raf = window.requestAnimationFrame(render);
    });
    el.addEventListener('pointerleave', function () {
      tx = 0; ty = 0; hovering = false;
      if (!raf) raf = window.requestAnimationFrame(render);
    });
  }
  addTilt(document.querySelector('.browser-frame'), 7);
  document.querySelectorAll('.card').forEach(function (card) { addTilt(card, 4); });
  addTilt(document.querySelector('.about-photo img'), 5);

  /* ---------- animated stat counters ---------- */
  var counters = document.querySelectorAll('.stats strong');
  function animateCount(el) {
    var text = el.textContent.trim();
    var match = text.match(/^(\d+)(.*)$/);
    if (!match || reduceMotion) { el.textContent = text; return; }
    var end = parseInt(match[1], 10), suffix = match[2] || '', startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / 1100, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); counterObserver.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- subtle reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var target = en.target;
        target.classList.add('visible');
        io.unobserve(target);
        window.setTimeout(function () {
          target.classList.remove('reveal');
          target.style.transitionDelay = '';
        }, 780);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.hero-copy > *, .hero-visual, .section-title, .section-sub, .card, .service, .yt-strip, .about-grid > *, .contact-grid > *')
    .forEach(function (el) {
      el.classList.add('reveal');
      if ((el.classList.contains('card') || el.classList.contains('service')) && el.parentElement) {
        var siblings = Array.prototype.slice.call(el.parentElement.children);
        el.style.transitionDelay = Math.min(siblings.indexOf(el) * 70, 280) + 'ms';
      }
      io.observe(el);
    });
})();
