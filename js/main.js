/* CLS Electrical — shared site JS */
(function () {
  'use strict';

  /* ------- Mobile navigation ------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primaryNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ------- Sticky header shadow + back-to-top ------- */
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) {
    toTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------- Reveal on scroll ------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ------- Current year ------- */
  var years = document.querySelectorAll('.js-year');
  var y = new Date().getFullYear();
  years.forEach(function (el) { el.textContent = y; });

  /* ------- Quote form ------- */
  var form = document.getElementById('quoteForm');
  if (form) {
    var success = document.getElementById('formSuccess');
    var uploadEl = document.getElementById('projectDocs');
    try {
      var input = document.getElementById('projectDocsInput');
      if (input && uploadEl) {
        input.addEventListener('change', function () {
          var names = Array.prototype.map.call(input.files, function (f) { return f.name; }).join(', ');
          uploadEl.querySelector('.fu-name').textContent = names || 'UPLOAD PROJECT DOCUMENTS';
        });
        ['dragenter', 'dragover'].forEach(function (ev) {
          uploadEl.addEventListener(ev, function (e) { e.preventDefault(); uploadEl.classList.add('drag'); });
        });
        ['dragleave', 'drop'].forEach(function (ev) {
          uploadEl.addEventListener(ev, function (e) { e.preventDefault(); uploadEl.classList.remove('drag'); });
        });
        uploadEl.addEventListener('drop', function (e) {
          input.files = e.dataTransfer.files;
          var names = Array.prototype.map.call(input.files, function (f) { return f.name; }).join(', ');
          uploadEl.querySelector('.fu-name').textContent = names || 'UPLOAD PROJECT DOCUMENTS';
        });
        uploadEl.addEventListener('click', function () { input.click(); });
      }
    } catch (e) { /* file input features are optional */ }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'SENDING…';
      var action = form.getAttribute('action') || '#';
      /* Best-effort POST; if no server endpoint the success note still shows
         so a demo host without backend can confirm the flow. */
      fetch(action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function () { showSuccess(); })
        .catch(function () { showSuccess(); })
        .finally(function () {
          btn.disabled = false;
          btn.innerHTML = original;
          form.reset();
          if (uploadEl) uploadEl.querySelector('.fu-name').textContent = 'UPLOAD PROJECT DOCUMENTS';
        });
    });
  }

  function showSuccess() {
    var el = document.getElementById('formSuccess');
    if (el) { el.classList.add('show'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }

  /* ------- Animated stat counters ------- */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-ZA') + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-ZA') + suffix;
    }
    requestAnimationFrame(step);
  }
})();
