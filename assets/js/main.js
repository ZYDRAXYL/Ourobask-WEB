/* Ourobask — สคริปต์ของหน้าเว็บแนะนำแอป
   ไม่มี dependency ภายนอก และทุกส่วนทำงานแยกกันได้
   ถ้าส่วนใดพัง (เช่น เรียก GitHub API ไม่ได้) หน้าเว็บยังใช้งานได้ตามปกติ */

(function () {
  'use strict';

  var REPO = 'LDKTC/App-Ourobask';
  var THEME_KEY = 'ourobask-theme';

  /* ── ธีมสว่าง/มืด ───────────────────────────────────────────── */

  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');

  function setTheme(theme) {
    root.dataset.theme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#141218' : '#6750a4';
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* โหมดส่วนตัวของบางเบราว์เซอร์เขียนไม่ได้ — ไม่เป็นไร */
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  // ตามระบบต่อไป ตราบใดที่ผู้ใช้ยังไม่เคยเลือกธีมเอง
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function (e) {
    var chosen = null;
    try {
      chosen = localStorage.getItem(THEME_KEY);
    } catch (err) {
      /* อ่านไม่ได้ก็ถือว่ายังไม่เคยเลือก */
    }
    if (!chosen) root.dataset.theme = e.matches ? 'dark' : 'light';
  };
  if (media.addEventListener) media.addEventListener('change', onSchemeChange);
  else if (media.addListener) media.addListener(onSchemeChange);

  /* ── เมนูบนจอเล็ก ───────────────────────────────────────────── */

  var nav = document.getElementById('site-nav');
  var navToggle = document.getElementById('nav-toggle');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'เปิดเมนู');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 780) closeNav();
    });
  }

  /* ── เส้นคั่นใต้ header เมื่อเลื่อนลง ───────────────────────── */

  var header = document.getElementById('site-header');
  if (header) {
    var syncHeader = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  /* ── ไฮไลต์เมนูตามหัวข้อที่กำลังอ่าน ───────────────────────── */

  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ── ค่อย ๆ ปรากฏตอนเลื่อนถึง ──────────────────────────────── */

  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    revealables.forEach(function (el) {
      revealer.observe(el);
    });
  } else {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── ปีปัจจุบันใน footer ────────────────────────────────────── */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── ดึงรีลีสล่าสุดจาก GitHub มาแสดง ───────────────────────── */

  function formatSize(bytes) {
    if (!bytes) return '';
    return (bytes / 1048576).toFixed(1).replace(/\.0$/, '') + ' MB';
  }

  function formatThaiDate(iso) {
    var date = new Date(iso);
    if (isNaN(date.getTime())) return '';
    try {
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return date.toISOString().slice(0, 10);
    }
  }

  // ชื่อไฟล์ของแต่ละสถาปัตยกรรมคือ ourobask-<tag>[-<abi>].apk
  function matchAsset(assets, abi) {
    return assets.filter(function (asset) {
      if (!/\.apk$/i.test(asset.name)) return false;
      if (abi === 'universal') return !/-(arm64-v8a|armeabi-v7a|x86_64)\.apk$/i.test(asset.name);
      return asset.name.indexOf('-' + abi + '.apk') !== -1;
    })[0];
  }

  function applyRelease(release) {
    var assets = release.assets || [];

    Array.prototype.forEach.call(
      document.querySelectorAll('[data-latest-version]'),
      function (el) {
        el.textContent = release.tag_name;
      }
    );

    var published = formatThaiDate(release.published_at);
    var dateEl = document.querySelector('[data-latest-date]');
    if (dateEl && published) dateEl.textContent = 'เผยแพร่เมื่อ ' + published;

    Array.prototype.forEach.call(
      document.querySelectorAll('[data-asset-url]'),
      function (link) {
        var asset = matchAsset(assets, link.getAttribute('data-asset-url'));
        if (asset) link.href = asset.browser_download_url;
      }
    );

    Array.prototype.forEach.call(
      document.querySelectorAll('[data-asset-size]'),
      function (el) {
        var asset = matchAsset(assets, el.getAttribute('data-asset-size'));
        var size = asset && formatSize(asset.size);
        if (size) el.textContent = size;
      }
    );
  }

  // ถ้าเรียกไม่สำเร็จ ค่าที่เขียนไว้ใน HTML และลิงก์ /releases/latest ยังใช้ได้อยู่
  if (window.fetch) {
    fetch('https://api.github.com/repos/' + REPO + '/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub API ตอบกลับ ' + res.status);
        return res.json();
      })
      .then(applyRelease)
      .catch(function () {
        /* เงียบไว้ — หน้าเว็บยังใช้งานได้ด้วยค่าเริ่มต้น */
      });
  }
})();
