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
      badge: 'Ready', badgeClass: 'badge-ready',
      desc: 'Complete billing and stock system for retail shops — fast checkout, inventory and khata in one offline app.',
      features: ['Fast barcode billing with receipts', 'Inventory with low-stock alerts', 'Khata (credit) customer accounts', 'Daily / monthly sales reports', '100% offline with auto-backup', 'License-key protected, one PC per license']
    },
    resto: {
      name: 'RestoPOS', target: 'For restaurants & cafes',
      badge: 'In development', badgeClass: 'badge-dev',
      desc: 'Restaurant management with table billing, kitchen order tickets and delivery tracking. Early version running; full release in development.',
      features: ['Table & floor-view management', 'KOT (kitchen order tickets)', 'Dine-in, takeaway & delivery modes', 'Waiter management & staff roles', 'Menu management with categories', 'License-key protected, LAN multi-PC support planned']
    },
    garments: {
      name: 'Garments POS', target: 'For garment & clothing retailers',
      badge: 'In development', badgeClass: 'badge-dev',
      desc: 'POS built for clothing stores — size and color-wise stock, barcode billing and khata. Product and purchase modules done; billing module next.',
      features: ['Size / color variant-wise stock', 'Barcode billing', 'Purchase & supplier management', 'Khata (credit) accounts', 'Stock, purchase & low-stock reports', '100% offline with auto-backup']
    },
    estate: {
      name: 'Estate Manager', target: 'For property dealers',
      badge: 'Ready', badgeClass: 'badge-ready',
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

  /* ---------- inquiry form: validate, then send straight to the inbox via Web3Forms ---------- */
  var form = document.getElementById('inquiryForm');
  var errBox = document.getElementById('formError');
  var okBox = document.getElementById('formSuccess');
  var submitBtn = document.getElementById('submitBtn');
  var WEB3FORMS_KEY = '9c0f122f-b1da-4f11-8556-1efaeb6e66c5';
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

    okBox.hidden = true;
    if (problems.length) {
      errBox.textContent = 'Please provide ' + problems.join(', ') + '.';
      errBox.hidden = false;
      return;
    }
    errBox.hidden = true;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: 'New inquiry — ' + software + ' (' + business + ') — Portfolio website',
        from_name: 'Ahmad Raza Portfolio',
        botcheck: '',
        'Name': name,
        'Email or phone': contact,
        'Business type': business,
        'Software': software,
        'Requirements': msg || '(not specified)'
      })
    }).then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.success) {
          form.reset();
          okBox.textContent = 'Thank you, ' + name.split(' ')[0] + '! Your inquiry has been received — I will get back to you shortly with a free demo.';
          okBox.hidden = false;
          okBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        } else {
          errBox.textContent = 'Sorry, the inquiry could not be sent. Please email me directly at ahmadraza.eccountant@gmail.com.';
          errBox.hidden = false;
        }
      })
      .catch(function () {
        errBox.textContent = 'Sorry, the inquiry could not be sent. Please check your internet connection, or email me directly at ahmadraza.eccountant@gmail.com.';
        errBox.hidden = false;
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Inquiry';
      });
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

/* ---------- Cart Dash mini game ---------- */
(function () {
  'use strict';
  var cvs = document.getElementById('gameCanvas');
  if (!cvs || !cvs.getContext) return;
  var ctx = cvs.getContext('2d');
  var btn = document.getElementById('gameBtn');
  var scoreEl = document.getElementById('gameScore');
  var bestEl = document.getElementById('gameBest');
  var W = 900, H = 240, GROUND = 198;
  var best = 0;
  try { best = parseInt(localStorage.getItem('cartDashBest') || '0', 10) || 0; } catch (e) {}
  bestEl.textContent = best;

  var state = 'ready', raf = null, frame = 0, speed = 5, score = 0, coinsGot = 0, dist = 0;
  var cart = { x: 96, y: GROUND - 46, groundY: GROUND - 46, vy: 0, spin: 0 };
  var boxes = [], coins = [], spawnT = 80, coinT = 160;
  var sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#dcebfd'); sky.addColorStop(1, '#f4f8ff');

  function updateScore() { scoreEl.textContent = score; }
  function reset() {
    frame = 0; speed = 5; score = 0; coinsGot = 0; dist = 0;
    boxes.length = 0; coins.length = 0; spawnT = 90; coinT = 170;
    cart.y = cart.groundY; cart.vy = 0; updateScore();
  }
  function jump() {
    if (state === 'playing' && cart.y >= cart.groundY - 0.5) cart.vy = -12.6;
  }
  function start() {
    reset(); state = 'playing'; btn.textContent = 'Restart';
    cancelAnimationFrame(raf); raf = requestAnimationFrame(step);
  }
  function over() {
    state = 'over'; cancelAnimationFrame(raf);
    if (score > best) {
      best = score; bestEl.textContent = best;
      try { localStorage.setItem('cartDashBest', String(best)); } catch (e) {}
    }
    btn.textContent = 'Play again'; draw();
  }

  function drawBG() {
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    var off = (dist * 0.3) % 130;
    ctx.fillStyle = 'rgba(37,99,235,.07)';
    for (var i = -1; i < 9; i++) {
      var x = i * 130 - off;
      ctx.fillRect(x, GROUND - 92, 86, 92);
      ctx.fillRect(x, GROUND - 62, 86, 4);
      ctx.fillRect(x, GROUND - 32, 86, 4);
    }
    ctx.fillStyle = '#123058'; ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = 'rgba(255,255,255,.28)';
    var goff = dist % 46;
    for (var gx = -46; gx < W; gx += 46) ctx.fillRect(gx - goff + 46, GROUND + 18, 22, 4);
  }
  function drawCart() {
    var x = cart.x, y = cart.y;
    ctx.save();
    ctx.fillStyle = '#f59e0b'; ctx.fillRect(x + 12, y - 3, 13, 10);
    ctx.fillStyle = '#2563eb'; ctx.fillRect(x + 30, y - 6, 9, 13);
    ctx.strokeStyle = '#0b1f3a'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 9, y + 9); ctx.lineTo(x + 1, y + 9);
    ctx.moveTo(x, y + 7); ctx.lineTo(x + 54, y + 7); ctx.lineTo(x + 47, y + 33); ctx.lineTo(x + 7, y + 33);
    ctx.closePath(); ctx.stroke();
    ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(11,31,58,.55)';
    for (var bx = 11; bx < 50; bx += 9) {
      ctx.beginPath(); ctx.moveTo(x + bx, y + 9); ctx.lineTo(x + bx - 2, y + 31); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(x + 3, y + 20); ctx.lineTo(x + 51, y + 20); ctx.stroke();
    ctx.fillStyle = '#0b1f3a';
    [[x + 14, y + 39], [x + 42, y + 39]].forEach(function (w) {
      ctx.beginPath(); ctx.arc(w[0], w[1], 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#9db9e8'; ctx.lineWidth = 1.6;
      for (var a = 0; a < 3; a++) {
        var ang = cart.spin + a * Math.PI / 3;
        ctx.beginPath();
        ctx.moveTo(w[0] - Math.cos(ang) * 5, w[1] - Math.sin(ang) * 5);
        ctx.lineTo(w[0] + Math.cos(ang) * 5, w[1] + Math.sin(ang) * 5);
        ctx.stroke();
      }
      ctx.strokeStyle = '#0b1f3a'; ctx.lineWidth = 3;
    });
    ctx.restore();
  }
  function drawBox(b) {
    var top = GROUND - b.h;
    ctx.fillStyle = '#c98d4e'; ctx.fillRect(b.x, top, b.w, b.h);
    ctx.fillStyle = '#a9713a'; ctx.fillRect(b.x + b.w / 2 - 3, top, 6, b.h);
    ctx.fillRect(b.x, top, b.w, 4);
    ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillRect(b.x + 5, top + 9, 12, 8);
  }
  function drawCoin(c) {
    var y = c.y + Math.sin(frame / 12 + c.x / 30) * 2.5;
    ctx.beginPath(); ctx.arc(c.x, y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24'; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = '#d97706'; ctx.stroke();
    ctx.fillStyle = '#92400e'; ctx.font = '700 8px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Rs', c.x, y + 0.5);
  }
  function panel(title, line1, line2) {
    ctx.fillStyle = 'rgba(11,31,58,.55)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.font = '800 34px Arial'; ctx.fillText(title, W / 2, 96);
    ctx.font = '600 17px Arial'; ctx.fillText(line1, W / 2, 128);
    ctx.font = '400 14px Arial'; ctx.fillStyle = '#c9dbf7'; ctx.fillText(line2, W / 2, 154);
  }
  function draw() {
    drawBG();
    coins.forEach(drawCoin);
    boxes.forEach(drawBox);
    drawCart();
    if (state === 'ready') panel('CART DASH', 'Dodge the stock boxes, grab the coins!', 'Press SPACE or tap Play');
    if (state === 'over') panel('GAME OVER', 'Score: ' + score + '   ·   Best: ' + best, 'Tap Play again to retry');
  }
  function step() {
    frame++; dist += speed; speed = Math.min(11, speed + 0.0035);
    cart.vy += 0.62; cart.y += cart.vy;
    if (cart.y >= cart.groundY) { cart.y = cart.groundY; cart.vy = 0; }
    cart.spin += speed * 0.05;
    if (--spawnT <= 0) {
      boxes.push({ x: W + 12, w: 30 + Math.random() * 16, h: 26 + Math.random() * 22 });
      spawnT = Math.max(44, (72 + Math.random() * 58) * (5.4 / speed));
    }
    if (--coinT <= 0) {
      var cy = GROUND - 72 - Math.random() * 46;
      for (var i = 0; i < 3; i++) coins.push({ x: W + 24 + i * 30, y: cy, r: 9 });
      coinT = 180 + Math.random() * 170;
    }
    var i, b;
    for (i = boxes.length - 1; i >= 0; i--) {
      b = boxes[i]; b.x -= speed;
      if (b.x < -60) { boxes.splice(i, 1); continue; }
      if (cart.x + 52 > b.x + 3 && cart.x + 4 < b.x + b.w - 3 && cart.y + 44 > GROUND - b.h + 4) { over(); return; }
    }
    for (i = coins.length - 1; i >= 0; i--) {
      var c = coins[i]; c.x -= speed;
      if (c.x < -20) { coins.splice(i, 1); continue; }
      var dx = c.x - (cart.x + 28), dy = c.y - (cart.y + 18);
      if (dx * dx + dy * dy < 36 * 36) { coins.splice(i, 1); coinsGot++; }
    }
    score = Math.floor(dist / 8) + coinsGot * 15; updateScore();
    draw();
    if (state === 'playing') raf = requestAnimationFrame(step);
  }
  function act() { if (state === 'playing') jump(); else start(); }
  btn.addEventListener('click', start);
  cvs.addEventListener('click', act);
  cvs.addEventListener('touchstart', function (e) { e.preventDefault(); act(); }, { passive: false });
  window.addEventListener('keydown', function (e) {
    if (e.code !== 'Space' && e.code !== 'ArrowUp' && e.code !== 'KeyW') return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    var r = cvs.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) { e.preventDefault(); act(); }
  });
  reset(); draw();
})();

/* ---------- Smart assistant (rule-based chat) ---------- */
(function () {
  'use strict';
  var fab = document.getElementById('chatFab');
  var panel = document.getElementById('chatPanel');
  var body = document.getElementById('chatBody');
  var chipsBox = document.getElementById('chatChips');
  var form = document.getElementById('chatForm');
  var input = document.getElementById('chatText');
  var closeBtn = document.getElementById('chatClose');
  if (!fab || !panel || !body || !form) return;

  var QA = [
    { k: ['salam', 'assalam', 'hello', 'hi', 'hey', 'aoa'],
      en: "Hello! I'm Ahmad's assistant. I can tell you about his software (Shop POS, RestoPOS, Garments POS, Estate Manager), the free demo, delivery and support. What would you like to know?",
      ur: "Assalam-o-Alaikum! Main Ahmad ka assistant hun. Main aap ko un ke software (Shop POS, RestoPOS, Garments POS, Estate Manager), free demo, delivery aur support ke baray mein bata sakta hun. Aap kya janna chahte hain?" },
    { k: ['price', 'cost', 'rate', 'charges', 'keemat', 'qemat', 'kitne', 'kitna', 'paisay'],
      en: "Prices depend on your business and the features you need, so Ahmad confirms them personally. The demo is completely free, and there are no monthly fees — it's a lifetime license.\nFor an exact quote, fill the inquiry form on this page and Ahmad will reply himself.",
      ur: "Price har business ki zaroorat aur features par hoti hai, is liye Ahmad exact price khud confirm karte hain. Demo bilkul FREE hai, aur monthly fees koi nahi — lifetime license hai.\nExact price ke liye is page ka inquiry form bhar dein, Ahmad khud jawab dein ge." },
    { k: ['demo', 'trial', 'try', 'test karna'],
      en: "The demo is free. Fill the inquiry form on this page (or email ahmadraza.eccountant@gmail.com) and tell us your business type — Ahmad will show the software working on your own business data. No payment before the demo.",
      ur: "Demo bilkul free hai. Is page ka inquiry form bhar dein (ya ahmadraza.eccountant@gmail.com par email karein) aur apne business ki type likh dein — Ahmad software aap ke apne business data par chala kar dikhayenge. Demo se pehle koi payment nahi." },
    { k: ['shop pos', 'shop', 'dukaan', 'dukan', 'retail', 'kiryana', 'general store'],
      en: "Shop POS (ready now) is a complete billing & stock system for retail shops: fast barcode billing with printed receipts, inventory with low-stock alerts, khata (credit) accounts, and daily/monthly reports. 100% offline with auto-backup. Want a free demo?",
      ur: "Shop POS (ready hai) retail shops ke liye complete billing aur stock system hai: tez barcode billing + printed receipt, inventory with low-stock alerts, khata (udhaar) accounts, aur daily/monthly reports. 100% offline, auto-backup ke saath. Free demo chahiye?" },
    { k: ['resto', 'restaurant', 'hotel', 'cafe', 'kitchen', 'table'],
      en: "RestoPOS is for restaurants & cafes: table/floor management, KOT (kitchen order tickets), and dine-in, takeaway & delivery orders. It is currently in development — an early version is already running. Ahmad can show you the progress.",
      ur: "RestoPOS restaurants aur cafes ke liye hai: table/floor management, KOT (kitchen tickets), aur dine-in, takeaway aur delivery orders. Ye abhi development mein hai — early version chal raha hai. Ahmad progress dikha sakte hain." },
    { k: ['garment', 'kapra', 'kapray', 'clothing', 'boutique'],
      en: "Garments POS is built for clothing stores: size & color-wise stock, barcode billing, purchase & supplier records, khata accounts and stock reports. It is in development — the product and purchase modules are complete. Ask Ahmad for a progress demo.",
      ur: "Garments POS kapron ki shops ke liye hai: size aur color ke hisaab se stock, barcode billing, purchase aur supplier records, khata accounts aur stock reports. Ye development mein hai — product aur purchase modules mukammal hain. Ahmad se progress demo maang sakte hain." },
    { k: ['estate', 'property', 'plot', 'dealer', 'rent', 'kiraya', 'qist', 'installment'],
      en: "Estate Manager (ready now) is for property dealers: property listings (plot/house/shop), client records with CNIC, deals with bayana & commission, installment (qist) schedules, monthly rent collection and reports with CSV export. 100% offline.",
      ur: "Estate Manager (ready hai) property dealers ke liye hai: property listings (plot/house/shop), CNIC ke saath client records, bayana aur commission wale deals, qist schedules, monthly rent collection aur CSV reports. 100% offline." },
    { k: ['offline', 'internet', 'wifi', 'online', 'net '],
      en: "All of Ahmad's software is 100% offline — no internet needed. Your data stays on your own computer, with automatic backups.",
      ur: "Ahmad ke tamam software 100% offline hain — internet ki zaroorat nahi. Aap ka data aap ke apne computer par rehta hai, automatic backup ke saath." },
    { k: ['deliver', 'delivery', 'install', 'setup', 'how long', 'kitne din', 'kab milega', 'time'],
      en: "Ready software (Shop POS, Estate Manager) is set up quickly once you confirm — Ahmad personally helps with installation and setup. For the exact timeline for your business, send an inquiry and he will confirm.",
      ur: "Ready software (Shop POS, Estate Manager) confirm karne ke baad jald setup ho jata hai — installation aur setup mein Ahmad khud madad karte hain. Apne business ke liye exact time chahiye to inquiry bhej dein, wo confirm kar dein ge." },
    { k: ['training', 'support', 'seekhna', 'sikha', 'masla', 'problem', 'help'],
      en: "Every product comes with setup guidance, and Ahmad personally supports his customers by email (ahmadraza.eccountant@gmail.com). If anything goes wrong, email him what happened and he will help you fix it.",
      ur: "Har product ke saath setup guidance milti hai, aur Ahmad apne customers ko khud email par support karte hain (ahmadraza.eccountant@gmail.com). Koi masla ho to email kar dein, wo hal kar dein ge." },
    { k: ['license', 'licence', 'monthly', 'subscription', 'payment', 'pay', 'buy', 'khareed'],
      en: "Simple model: one lifetime license — no monthly fees, no subscription. You see a free demo first and pay only when you are satisfied. For the exact price for your business, ask through the inquiry form.",
      ur: "Simple model hai: ek dafa ka lifetime license — na monthly fees, na subscription. Pehle free demo dekhein, pasand aye tab hi payment. Exact price ke liye inquiry form se pooch lein." },
    { k: ['custom', 'website', 'web', 'banwana', 'new software', 'apna software', 'system'],
      en: "Ahmad also builds custom software around your business problem — billing systems, inventory control, khata management and business websites. Describe your problem in the inquiry form and he will suggest the right solution.",
      ur: "Ahmad aap ke business ke maslay ke hisaab se custom software bhi banate hain — billing systems, inventory control, khata management aur business websites. Inquiry form mein apna masla likh dein, wo behtareen hal suggest karein ge." },
    { k: ['contact', 'email', 'phone', 'number', 'whatsapp', 'rabta', 'call'],
      en: "You can reach Ahmad by email at ahmadraza.eccountant@gmail.com, or fill the inquiry form on this page — every inquiry lands straight in his inbox and he replies personally.",
      ur: "Ahmad se rabta email par karein: ahmadraza.eccountant@gmail.com — ya isi page ka inquiry form bhar dein. Har inquiry seedha un ki inbox mein jati hai aur wo khud jawab dete hain." },
    { k: ['who', 'ahmad', 'kaun', 'developer', 'about'],
      en: "Ahmad Raza is a software developer from Pakistan. He builds offline POS, ERP and inventory software for shops, restaurants and growing businesses — practical systems, with a free demo before you pay anything.",
      ur: "Ahmad Raza Pakistan se software developer hain. Wo shops, restaurants aur growing businesses ke liye offline POS, ERP aur inventory software banate hain — pehle free demo, payment baad mein." },
    { k: ['game', 'khel', 'dash', 'play'],
      en: "There's a mini game on this page — Cart Dash! Scroll to the 'Take a break' section: dodge the stock boxes and grab the coins. Space or tap to jump.",
      ur: "Is page par ek mini game bhi hai — Cart Dash! 'Take a break' wale section mein jayen: stock boxes se bachein, coins pakrein. Space ya tap se jump hota hai." },
    { k: ['thank', 'shukriya', 'great', 'nice', 'ok', 'okay', 'theek'],
      en: "You're welcome! If you'd like a free demo, the inquiry form on this page takes less than a minute — Ahmad replies personally.",
      ur: "Khush aamdeed! Agar free demo chahiye to is page ka inquiry form ek minute se kam mein bhar jata hai — Ahmad khud jawab dete hain." }
  ];
  var FALLBACK = {
    en: "That's a good question for Ahmad himself. Tap the button below and your question will be placed in the inquiry form — just add your name and contact, and Ahmad will reply personally. Or email him at ahmadraza.eccountant@gmail.com.",
    ur: "Ye sawal Ahmad khud behtar jawab dein ge. Neeche wala button dabayen — aap ka sawal inquiry form mein likh diya jayega, bas apna naam aur contact add kar dein, Ahmad khud jawab dein ge. Ya email karein: ahmadraza.eccountant@gmail.com."
  };
  var CHIP_LIST = ['Free demo', 'Shop POS', 'RestoPOS', 'Garments POS', 'Estate Manager', 'Delivery time', 'Price?', 'Contact Ahmad'];
  var greeted = false, lastQuestion = '';

  function isUrdu(text) {
    return /\b(hai|hain|ka|ki|ke|ko|mein|mai|mujhe|chahiye|kaise|kya|kitne|kitna|wala|wali|batao|karna|karo|bhai|aur|nahi|dukaan|kapray|keemat)\b/.test(text);
  }
  function answerFor(text) {
    var t = ' ' + text.toLowerCase() + ' ';
    var urdu = isUrdu(t);
    /* price intent always wins — a question about price must get the price answer,
       even when a product name is mentioned in the same sentence */
    var PRICE_STRONG = ['keemat', 'qemat', 'daam', 'price', 'cost', 'rate', 'charges', 'kitni', 'kitna', 'kitne'];
    for (var pi = 0; pi < PRICE_STRONG.length; pi++) {
      if (t.indexOf(PRICE_STRONG[pi]) > -1) return { text: urdu ? QA[1].ur : QA[1].en, fallback: false };
    }
    var best = null, bestHits = 0;
    QA.forEach(function (item) {
      var hits = 0;
      item.k.forEach(function (kw) { if (t.indexOf(kw) > -1) hits++; });
      if (hits > bestHits) { bestHits = hits; best = item; }
    });
    if (best) return { text: urdu ? best.ur : best.en, fallback: false };
    return { text: urdu ? FALLBACK.ur : FALLBACK.en, fallback: true };
  }
  function addMsg(text, who) {
    var d = document.createElement('div');
    d.className = 'msg ' + who;
    d.textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }
  function addAction(label, fn) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chat-action';
    b.textContent = label;
    b.addEventListener('click', fn);
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
  }
  function botReply(text) {
    var ans = answerFor(text);
    var typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    setTimeout(function () {
      typing.remove();
      addMsg(ans.text, 'bot');
      if (ans.fallback) {
        addAction('Send my question to Ahmad →', function () {
          var msgField = document.getElementById('fMsg');
          if (msgField && lastQuestion) msgField.value = lastQuestion;
          toggle(false);
          var contact = document.getElementById('contact');
          if (contact) contact.scrollIntoView({ behavior: 'smooth' });
          var nameField = document.getElementById('fName');
          if (nameField) setTimeout(function () { nameField.focus({ preventScroll: true }); }, 650);
        });
      }
    }, 550 + Math.random() * 350);
  }
  function send(text) {
    var clean = (text || '').trim();
    if (!clean) return;
    lastQuestion = clean;
    addMsg(clean, 'user');
    input.value = '';
    botReply(clean);
  }
  CHIP_LIST.forEach(function (label) {
    var c = document.createElement('button');
    c.type = 'button';
    c.className = 'chip';
    c.textContent = label;
    c.addEventListener('click', function () { send(label); });
    chipsBox.appendChild(c);
  });
  function toggle(open) {
    var willOpen = typeof open === 'boolean' ? open : panel.hidden;
    panel.hidden = !willOpen;
    fab.setAttribute('aria-expanded', String(willOpen));
    if (willOpen && !greeted) {
      greeted = true;
      setTimeout(function () {
        addMsg("Assalam-o-Alaikum! I'm Ahmad's assistant. Ask me anything about his software, the free demo, delivery or support — or tap a topic below.", 'bot');
      }, 250);
    }
    if (willOpen) setTimeout(function () { input.focus({ preventScroll: true }); }, 80);
  }
  fab.addEventListener('click', function () { toggle(); });
  closeBtn.addEventListener('click', function () { toggle(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) toggle(false);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    send(input.value);
  });
})();
