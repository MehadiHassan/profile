/* Md. Mehadi Hassan — profile interactions
   Vanilla JS, no dependencies. Every enhancement degrades gracefully. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Theme toggle ---------- */
  (function theme() {
    var btn = $('#themeToggle');
    if (!btn) return;

    function sync() {
      var isDark = root.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-pressed', String(!isDark));
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('mh-theme', next); } catch (e) {}
      sync();
    });

    sync();
  })();

  /* ---------- Mobile navigation ---------- */
  (function mobileNav() {
    var toggle = $('#navToggle');
    var nav = $('#primaryNav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setOpen(false);
    });
  })();

  /* ---------- Header state, scroll progress, back to top ---------- */
  (function scrollUi() {
    var header = $('#siteHeader');
    var bar = $('#scrollBar');
    var toTop = $('#toTop');
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;

      if (header) header.classList.toggle('is-stuck', y > 12);
      if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      if (toTop) {
        var show = y > 600;
        toTop.hidden = !show;
        toTop.classList.toggle('is-visible', show);
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }

    update();
  })();

  /* ---------- Scroll spy ---------- */
  (function scrollSpy() {
    var links = $$('.nav a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var sections = links.map(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = link;
      return section;
    }).filter(Boolean);

    function activate(id) {
      links.forEach(function (link) {
        var on = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', on);
        if (on) { link.setAttribute('aria-current', 'true'); }
        else { link.removeAttribute('aria-current'); }
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) activate(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  })();

  /* ---------- Reveal on scroll ---------- */
  (function reveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        window.setTimeout(function () { el.classList.add('is-visible'); }, i * 70);
        observer.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- Typing effect ---------- */
  (function typing() {
    var el = $('#typedRole');
    if (!el) return;

    var roles = [
      'Staff Software Engineer',
      'Full-Stack Engineer',
      'AI-Assisted Development Advocate',
      'Team Lead & Mentor',
      'Content Creator'
    ];

    if (reduceMotion) { el.textContent = roles[0]; return; }

    var roleIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      var current = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      el.textContent = current.slice(0, charIndex);

      var delay = deleting ? 38 : 72;
      if (!deleting && charIndex === current.length) {
        delay = 1900;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 320;
      }
      window.setTimeout(tick, delay);
    }

    el.textContent = '';
    window.setTimeout(tick, 600);
  })();

  /* ---------- Animated counters ---------- */
  (function counters() {
    var nums = $$('.stat-num');
    if (!nums.length) return;

    function render(el, value) {
      el.textContent = value + (el.dataset.suffix || '');
    }

    function run(el) {
      var target = parseInt(el.dataset.count, 10) || 0;
      if (reduceMotion) { render(el, target); return; }

      var duration = 1200;
      var start = performance.now();

      function frame(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        render(el, Math.round(target * eased));
        if (p < 1) window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(function (el) { render(el, parseInt(el.dataset.count, 10) || 0); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- Skills filter ---------- */
  (function skillFilter() {
    var buttons = $$('.chip-btn');
    var skills = $$('#skillGrid .skill');
    var status = $('#filterStatus');
    if (!buttons.length || !skills.length) return;

    function apply(filter) {
      var shown = 0;
      skills.forEach(function (skill) {
        var match = filter === 'all' || skill.dataset.cat === filter;
        skill.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      if (status) {
        status.textContent = filter === 'all'
          ? 'Showing all ' + shown + ' technologies.'
          : 'Showing ' + shown + ' of ' + skills.length + ' technologies.';
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', String(on));
        });
        apply(btn.dataset.filter);
      });
    });

    apply('all');
  })();

  /* ---------- Disclosures (experience, abstract) ---------- */
  (function disclosures() {
    $$('.disclosure').forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      var label = $('.disclosure-label', btn);
      var openText = label ? (label.textContent === 'Read abstract' ? 'Hide abstract' : 'Hide details') : '';
      var closedText = label ? label.textContent : '';

      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
        if (label) label.textContent = open ? closedText : openText;
      });
    });
  })();

  /* ---------- Endorsement expand / collapse ---------- */
  (function quotes() {
    $$('.quote-more').forEach(function (btn) {
      var quote = document.getElementById(btn.getAttribute('aria-controls'));
      if (!quote) return;

      // Nothing to reveal if the text already fits.
      if (quote.scrollHeight <= quote.clientHeight + 2) {
        quote.classList.remove('is-clamped');
        btn.remove();
        return;
      }

      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        quote.classList.toggle('is-clamped', expanded);
        btn.textContent = expanded ? 'Read full recommendation' : 'Show less';
      });
    });
  })();

  /* ---------- Pointer glow on cards ---------- */
  (function glow() {
    if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;

    $$('.glow-card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  })();

  /* ---------- Copy email ---------- */
  (function copyEmail() {
    var btn = $('#copyEmail');
    var toast = $('#toast');
    if (!btn) return;

    function notify(message) {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('is-visible');
      window.clearTimeout(notify.timer);
      notify.timer = window.setTimeout(function () {
        toast.classList.remove('is-visible');
      }, 2200);
    }

    btn.addEventListener('click', function () {
      var email = btn.dataset.email;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(
          function () { notify('Email copied to clipboard'); },
          function () { notify(email); }
        );
      } else {
        notify(email);
      }
    });
  })();

  /* ---------- Footer year ---------- */
  (function year() {
    var el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  })();
})();
