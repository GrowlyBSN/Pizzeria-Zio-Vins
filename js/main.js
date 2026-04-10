/* ============================================================
   Da Zio Vins – main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. Nav scroll ─────────────────────────────────────── */
  var nav = document.getElementById('main-nav');

  if (nav) {
    function handleNavScroll() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  /* ── 2. Mobile menu ────────────────────────────────────── */
  var hamburger   = document.getElementById('hamburger');
  var mobileMenu  = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });

    var mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── 3. Hero pizza animation (GSAP ScrollTrigger) ──────── */
  var heroPizzaGroup = document.getElementById('hero-pizza-group');

  if (heroPizzaGroup && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    var isMobile = window.innerWidth <= 640;

    if (!isMobile) {
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start:   'top top',
          end:     '+=130%',
          pin:     true,
          scrub:   1.5,
          anticipatePin: 1
        }
      });

      /*
       * La pizza (z-index 8, visibile sopra il forno) sale verso la bocca del forno.
       * Si rimpicciolisce in prospettiva e svanisce quando raggiunge l'interno buio.
       * L'effetto "entra nel forno" si crea perché la pizza si restringe verso il
       * centro della bocca e poi viene "inghiottita" dall'oscurità dell'interno.
       */

      // Fase 1 (0 → 0.7): la pizza sale verso la bocca e si rimpicciolisce
      tl.to('#hero-pizza-group', {
        y:     '-30vh',
        scale: 0.38,
        ease:  'power2.in'
      }, 0);

      // Fase 2 (0.7 → 1): l'ultimo tratto, già dentro la bocca, svanisce nell'oscurità
      tl.to('#hero-pizza-group', {
        y:       '-40vh',
        scale:   0.18,
        opacity: 0,
        ease:    'power3.in'
      }, 0.7);

      // Bagliore forno si intensifica man mano che la pizza entra
      var ovenGlow = document.getElementById('oven-glow');
      if (ovenGlow) {
        tl.to('#oven-glow', {
          opacity: 1,
          ease:    'power1.inOut'
        }, 0);
      }

      // Fiamme si alzano
      var ovenFlames = document.querySelectorAll('.oven-flames');
      if (ovenFlames.length) {
        tl.to('.oven-flames', {
          opacity: 1,
          ease:    'power1.inOut'
        }, 0);
      }

      // Testo hero sparisce verso l'alto
      var heroText = document.getElementById('hero-text');
      if (heroText) {
        tl.to('#hero-text', {
          opacity:  0,
          y:        -50,
          ease:     'power2.in'
        }, 0);
      }

    } else {
      // Mobile: semplice fade con piccolo movimento
      var simpleTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start:   'top top',
          end:     '+=70%',
          scrub:   1
        }
      });

      simpleTl.to('#hero-pizza-group', {
        y:       '-20vh',
        scale:   0.5,
        opacity: 0,
        ease:    'power1.in'
      }, 0);

      simpleTl.to('#hero-text', {
        opacity: 0,
        y:       -25,
        ease:    'power1.in'
      }, 0);
    }
  }

  /* ── 4. Reveal on scroll ───────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold:   0.1,
      rootMargin:  '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── 5. Menu tabs ──────────────────────────────────────── */
  var menuTabs       = document.querySelectorAll('.menu-tab');
  var menuCategories = document.querySelectorAll('.menu-category');

  if (menuTabs.length) {
    menuTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Remove active from all tabs and categories
        menuTabs.forEach(function (t) { t.classList.remove('active'); });
        menuCategories.forEach(function (c) { c.classList.remove('active'); });

        // Activate clicked tab
        tab.classList.add('active');

        // Activate corresponding category
        var catId = 'cat-' + tab.getAttribute('data-cat');
        var catEl = document.getElementById(catId);
        if (catEl) {
          catEl.classList.add('active');
        }
      });
    });

    // Activate first tab on load if none active
    var activeTab = document.querySelector('.menu-tab.active');
    if (!activeTab && menuTabs.length > 0) {
      menuTabs[0].click();
    }
  }

  /* ── 6. Smooth scroll with nav offset ─────────────────── */
  var NAV_OFFSET = 72;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      var top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── 7. Parallax leggero ───────────────────────────────── */
  var parallaxEls = document.querySelectorAll('.parallax-bg');

  if (parallaxEls.length) {
    function handleParallax() {
      var scrollY = window.scrollY;
      parallaxEls.forEach(function (el) {
        var rect     = el.getBoundingClientRect();
        var relY     = (rect.top + rect.height / 2) - window.innerHeight / 2;
        var offset   = relY * 0.2;
        el.style.backgroundPositionY = (50 + offset * 0.05) + '%';
      });
    }

    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax();
  }

});
