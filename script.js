/* ============================================================
   DRISHA PANJA — PORTFOLIO JAVASCRIPT
   Style: Editorial Bold Dark · SAN Life Design inspired
   ============================================================ */

emailjs.init({
  publicKey: "uWZv58RBgHOTrGmsh",
});

'use strict';

/* ══════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('loader');
  const numEl = document.getElementById('loaderNum');
  let count = 0;
  const target = 100;
  const dur = 1800; // ms
  const step = dur / target;

  const ticker = setInterval(() => {
    count = Math.min(count + 1, target);
    numEl.textContent = count;
    if (count >= target) clearInterval(ticker);
  }, step);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('out');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      // Kick off hero reveal
      revealHero();
    }, 2000);
  });
})();


/* ══════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════ */
(function initCursor() {
  // Only on true pointer devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  // Ring follows with smooth lerp
  (function lerp() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(lerp);
  })();

  // Enlarge on interactive elements
  const hoverable = 'a, button, .wcard, .svc-card, .skrow, .tl-item, .tc, .ftab';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverable)) ring.classList.add('big');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverable)) ring.classList.remove('big');
  });
})();

/* ══════════════════════════════════════════
   3. SCROLL PROGRESS BAR
══════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ══════════════════════════════════════════
   4. NAVBAR — scroll glass + active link
══════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navHam = document.getElementById('navHam');
  const drawer = document.getElementById('navDrawer');
  const navLinks = document.querySelectorAll('.nl');

  // Glass on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  }, { passive: true });

  // Active link highlight based on scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href')?.slice(1) === current);
    });
  }
  updateActiveLink();

  // Hamburger toggle
  navHam.addEventListener('click', () => {
    const open = navHam.classList.toggle('open');
    drawer.classList.toggle('open', open);
    navHam.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
  });

  // Close drawer on link click
  drawer.querySelectorAll('.drawer-link').forEach(a => {
    a.addEventListener('click', () => {
      navHam.classList.remove('open');
      drawer.classList.remove('open');
      navHam.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
})();

/* ══════════════════════════════════════════
   5. SMOOTH SCROLL for all # links
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ══════════════════════════════════════════
   6. DARK / LIGHT THEME TOGGLE
══════════════════════════════════════════ */
(function initTheme() {
  const btn = document.getElementById('themeBtn');
  const html = document.documentElement;
  const saved = localStorage.getItem('dp-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  html.setAttribute('data-bs-theme', saved);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    html.setAttribute('data-bs-theme', next);
    localStorage.setItem('dp-theme', next);
  });
})();

/* ══════════════════════════════════════════
   7. NOISE CANVAS (hero texture)
══════════════════════════════════════════ */
(function initNoise() {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawNoise();
  }

  function drawNoise() {
    const w = canvas.width, h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.random() * 255 | 0;
      data[i] = val; // R
      data[i + 1] = val; // G
      data[i + 2] = val; // B
      data[i + 3] = 18;  // Alpha (subtle)
    }
    ctx.putImageData(imageData, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  // Animate noise subtly
  let lastTime = 0;
  function animNoise(t) {
    if (t - lastTime > 120) { drawNoise(); lastTime = t; }
    requestAnimationFrame(animNoise);
  }
  requestAnimationFrame(animNoise);
})();

/* ══════════════════════════════════════════
   8. HERO REVEAL (staggered entrance)
══════════════════════════════════════════ */
function revealHero() {
  const heroEls = document.querySelectorAll(
    '.hero-eyebrow, .hline-1, .hline-2, .hero-foot'
  );
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), i * 100);
  });
}

/* ══════════════════════════════════════════
   9. SCROLL REVEAL (Intersection Observer)
══════════════════════════════════════════ */
(function initScrollReveal() {
  const rvEls = document.querySelectorAll('.rv');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  rvEls.forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════
   10. SKILL BAR ANIMATION
══════════════════════════════════════════ */
(function initSkillBars() {
  // Skill row fill bars
  const fills = document.querySelectorAll('.skfill');
  const tcBars = document.querySelectorAll('.tc-bar div');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate all fills in skills section
        fills.forEach((f, i) => {
          setTimeout(() => f.classList.add('on'), i * 80);
        });
        // Animate tool card bars
        tcBars.forEach((b, i) => {
          const target = b.style.width;
          b.style.width = '0';
          setTimeout(() => {
            b.style.transition = 'width 1.2s cubic-bezier(0.23,1,0.32,1)';
            b.style.width = target;
          }, 200 + i * 100);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.25 });

  const skillSection = document.getElementById('skills');
  if (skillSection) obs.observe(skillSection);
})();

/* ══════════════════════════════════════════
   11. COUNTER ANIMATION (About stats)
══════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.as-num[data-count]');
  if (!counters.length) return;

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.querySelector('span')?.outerHTML || '';
    const dur = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(eased * target);
      el.innerHTML = val + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.innerHTML = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(c => animateCount(c));
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) obs.observe(aboutSection);
})();

/* ══════════════════════════════════════════
   12. PROJECT FILTER TABS
══════════════════════════════════════════ */
(function initFilter() {
  const tabs = document.querySelectorAll('.ftab');
  const cards = document.querySelectorAll('#worksGrid .wcard');
  const seps = document.querySelectorAll('.works-cat-sep');

  function showCards(filter) {
    // Handle separators
    seps.forEach(sep => {
      const sepCat = sep.dataset.sep;
      const visible = filter === 'all' || sepCat === filter;
      sep.style.display = visible ? '' : 'none';
    });

    let visIdx = 0;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      if (match) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px) scale(0.96)';
        const delay = visIdx * 60;
        setTimeout(() => {
          card.style.transition = 'opacity .45s ease, transform .45s ease';
          card.style.opacity = '1';
          card.style.transform = '';
        }, delay);
        visIdx++;
      } else {
        card.style.transition = 'opacity .25s ease, transform .25s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.94)';
        setTimeout(() => card.classList.add('hidden'), 260);
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      showCards(tab.dataset.f);
    });
  });
})();

/* ══════════════════════════════════════════
   14. CONTACT FORM VALIDATION
══════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = [
    { input: '#fName', error: '#eNm', label: 'Name', min: 2 },
    { input: '#fEmail', error: '#eEm', label: 'Email', email: true },
    { input: '#fSub', error: '#eSb', label: 'Subject', min: 3 },
    { input: '#fMsg', error: '#eMg', label: 'Message', min: 10 },
  ];

  function validate(field) {
    const inp = form.querySelector(field.input);
    const err = form.querySelector(field.error);
    const val = inp.value.trim();
    let msg = '';

    if (!val) msg = `${field.label} is required.`;
    else if (field.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Enter a valid email.';
    else if (field.min && val.length < field.min) msg = `${field.label} must be at least ${field.min} characters.`;

    inp.classList.toggle('err', !!msg);
    err.textContent = msg;
    return !msg;
  }





  // Real-time feedback
  fields.forEach(f => {
    const inp = form.querySelector(f.input);
    inp.addEventListener('blur', () => validate(f));
    inp.addEventListener('input', () => { if (inp.classList.contains('err')) validate(f); });
  });

  form.addEventListener('submit', function (e) {

    e.preventDefault();

    const allValid = fields.map(validate).every(Boolean);

    if (!allValid) return;

    const btn = form.querySelector('.btn-primary');
    const btnText = btn.querySelector('.btn-text');

    btn.disabled = true;
    btnText.textContent = 'Sending...';

    emailjs.sendForm(
      "service_dv6y88b",
      "template_jbzh7iq",
      form
    )

      .then(() => {

        form.reset();

        btn.disabled = false;
        btnText.textContent = 'Send Message';

        const ok = document.getElementById('formOk');

        ok.hidden = false;

        setTimeout(() => {
          ok.hidden = true;
        }, 5000);

      })

      .catch((error) => {

        btn.disabled = false;
        btnText.textContent = 'Send Message';

        console.log("EMAILJS ERROR:", error);

        alert(JSON.stringify(error));

      });

  });

})();

/* ══════════════════════════════════════════
   15. BACK TO TOP
══════════════════════════════════════════ */
(function initBackToTop() {
  const btt = document.getElementById('btt');
  if (!btt) return;

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    btt.classList.toggle('show', show);
    btt.hidden = !show;
  }, { passive: true });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════════════
   16. FOOTER YEAR
══════════════════════════════════════════ */
const yearEl = document.getElementById('fYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ══════════════════════════════════════════
   17. CARD TILT (project cards)
══════════════════════════════════════════ */
(function initCardTilt() {
  document.querySelectorAll('.wcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * -3;
      const ry = ((e.clientX - cx) / (r.width / 2)) * 3;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(.985)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════
   19. TIMELINE ITEMS — stagger on scroll
══════════════════════════════════════════ */
(function initTimelineStagger() {
  const items = document.querySelectorAll('.tl-item.rv');
  items.forEach((item, i) => {
    item.style.setProperty('--delay', (i * 0.1) + 's');
  });
})();

/* ══════════════════════════════════════════
   20. PARALLAX — hero portrait + pills
══════════════════════════════════════════ */
(function initParallax() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const portrait = document.querySelector('.hero-portrait');
  const pills = document.querySelectorAll('.pill');
  const ghost = document.querySelector('.hero-ghost');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (portrait) portrait.style.transform = `translateY(${y * 0.12}px)`;
    if (ghost) ghost.style.transform = `translate(-50%, calc(-50% + ${y * 0.05}px))`;
    pills.forEach((pill, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      pill.style.transform = `translateY(${y * 0.06 * dir}px)`;
    });
  }, { passive: true });
})();

/* ══════════════════════════════════════════
   21. AMBIENT SECTION COLOUR
   (changes scroll-progress bar colour per section)
══════════════════════════════════════════ */
(function initAmbientColour() {
  const bar = document.getElementById('scrollProgress');
  const colourMap = {
    hero: '#3ddc84',
    works: '#4d7cff',
    about: '#3ddc84',
    skills: '#f5a623',
    services: '#a855f7',
    exp: '#4d7cff',
    testi: '#ff4d5a',
    contact: '#3ddc84',
  };
  const sections = document.querySelectorAll('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && bar) {
        bar.style.background = colourMap[e.target.id] || '#3ddc84';
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
})();

/* ══════════════════════════════════════════
   22. KEYBOARD ACCESSIBILITY
══════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Tab') document.body.classList.add('kb-nav');
});
document.addEventListener('mousedown', () => {
  document.body.classList.remove('kb-nav');
});

/* ══════════════════════════════════════════
   23. REDUCED MOTION OVERRIDE
══════════════════════════════════════════ */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Kill canvas noise animation, slow all transitions
  document.documentElement.style.setProperty('--t', '0.01s');
  document.documentElement.style.setProperty('--t-slow', '0.01s');
  const canvas = document.getElementById('noiseCanvas');
  if (canvas) canvas.style.display = 'none';
}

/* ══════════════════════════════════════════
   24. DEV CONSOLE SIGNATURE
══════════════════════════════════════════ */
console.log('%c✦ DRISHA PANJA', 'font-family:monospace;font-size:1.4rem;font-weight:bold;color:#3ddc84');
console.log('%cCreative Developer & Designer · Kolkata', 'font-family:monospace;font-size:.85rem;color:#7a7975');
console.log('%cHTML · CSS · JavaScript · Figma · Photoshop · Illustrator', 'font-family:monospace;font-size:.75rem;color:#4d7cff');








// GRAPHIC.JS CODE -----------------------------------------------------------------------------

const tags = document.querySelectorAll(".hero-tags span");

tags.forEach(tag=>{

    tag.addEventListener("mouseenter",()=>{

        tag.style.letterSpacing=".08em";

    });

    tag.addEventListener("mouseleave",()=>{

        tag.style.letterSpacing="0";

    });

});


