(function () {
  'use strict';

  var LANG_KEY = 'portfolio_lang';
  var THEME_KEY = 'portfolio-theme';

  var root = document.documentElement;

  function applyLanguage(lang) {
    var rtl = lang === 'ar';
    root.lang = lang;
    root.dir = rtl ? 'rtl' : 'ltr';
    root.classList.toggle('rtl-active', rtl);

    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      var labels = toggle.querySelectorAll('span');
      for (var i = 0; i < labels.length; i += 1) {
        var label = labels[i];
        if (label.classList.contains('sep')) continue;
        label.classList.toggle('on', label.textContent === (rtl ? 'عربي' : 'EN'));
      }
    }
  }

  function applyTheme(theme) {
    var next = theme === 'light' ? 'light' : 'dark';
    root.classList.toggle('dark', next === 'dark');
    root.classList.toggle('light', next === 'light');
    root.setAttribute('data-theme', next);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && meta.parentNode) {
      var saved = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch { /* storage unavailable */ }
      meta.setAttribute('content', saved === null ? (next === 'light' ? '#f8fafc' : '#050608') : meta.getAttribute('content'));
    }
  }

  function currentTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch { /* storage unavailable */ }
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function currentLanguage() {
    var saved = null;
    try {
      saved = localStorage.getItem(LANG_KEY);
    } catch { /* storage unavailable */ }
    return saved === 'ar' || saved === 'en' ? saved : 'en';
  }

  function echoPath() {
    var el = document.getElementById('js-path');
    if (!el) return;
    var path = location.pathname + location.search;
    if (path === '' || path === '/') {
      el.textContent = '/';
    } else {
      el.textContent = path.length > 72 ? path.slice(0, 72) + '…' : path;
    }
  }

  applyTheme(currentTheme());
  applyLanguage(currentLanguage());
  echoPath();

  var langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var next = currentLanguage() === 'ar' ? 'en' : 'ar';
      applyLanguage(next);
      try {
        localStorage.setItem(LANG_KEY, next);
      } catch { /* storage unavailable */ }
    });
  }

  // Follow the OS theme only when the visitor hasn't pinned one explicitly.
  if (window.matchMedia && localStorage !== null) {
    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem(THEME_KEY);
    } catch { /* storage unavailable */ }
    if (!savedTheme) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onSystemChange = function (event) {
        applyTheme(event.matches ? 'dark' : 'light');
      };
      if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
      else if (mq.addListener) mq.addListener(onSystemChange);
    }
  }
})();