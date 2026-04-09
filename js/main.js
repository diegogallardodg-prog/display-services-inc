// =============================================
// DISPLAY SERVICES INC. — Main JavaScript
// AgentDeploy TX | 2026-04-08
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAV SCROLL BEHAVIOR ----
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ---- MOBILE NAV TOGGLE ----
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    navLinks.classList.contains('open')
      ? (spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)',
         spans[1].style.opacity   = '0',
         spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)')
      : (spans[0].style.transform = '', spans[1].style.opacity = '', spans[2].style.transform = '');
  });

  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ---- SCROLL REVEAL ----
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => observer.observe(el));

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 16);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObserver.observe(el));

  // ---- PORTFOLIO FILTER ----
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.p-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('dim', !match);
      });
    });
  });

  // ---- SERVICE SEARCH ----
  const searchInput  = document.getElementById('service-search');
  const searchClear  = document.getElementById('search-clear');
  const searchHint   = document.getElementById('search-hint');
  const serviceCards = document.querySelectorAll('.svc-card');
  const divisions    = document.querySelectorAll('.division-block');

  function runSearch(query) {
    const q = query.trim().toLowerCase();
    searchClear.style.display = q ? 'flex' : 'none';

    if (!q) {
      serviceCards.forEach(c => { c.classList.remove('hidden', 'match'); });
      divisions.forEach(d => d.classList.remove('all-hidden'));
      searchHint.textContent = '';
      return;
    }

    let totalVisible = 0;
    serviceCards.forEach(card => {
      const text = ((card.dataset.keywords || '') + ' ' + card.innerText).toLowerCase();
      const isMatch = text.includes(q);
      card.classList.toggle('hidden', !isMatch);
      card.classList.toggle('match', isMatch);
      if (isMatch) totalVisible++;
    });

    // hide entire division block if none of its cards match
    divisions.forEach(div => {
      const visible = div.querySelectorAll('.svc-card:not(.hidden)').length;
      div.classList.toggle('all-hidden', visible === 0);
    });

    searchHint.textContent = totalVisible === 0
      ? `No services found for "${query}". Try a different term or contact us directly.`
      : `${totalVisible} service${totalVisible !== 1 ? 's' : ''} found for "${query}"`;
  }

  searchInput?.addEventListener('input', e => runSearch(e.target.value));
  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    runSearch('');
    searchInput.focus();
  });

  // ---- CONTACT FORM ----
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.textContent = '✓ Sent! We\'ll be in touch.';
    btn.style.background = '#22c55e';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send My Request →';
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 4000);
  });

  // =============================================
  // EMAIL CAPTURE POPUP
  // =============================================
  const popup        = document.getElementById('email-popup');
  const popupClose   = document.getElementById('popup-close');
  const popupForm    = document.getElementById('popup-form');
  const popupSuccess = document.getElementById('popup-success');

  const POPUP_KEY   = 'dsi_popup_dismissed';
  const POPUP_DONE  = 'dsi_popup_done';
  const dismissed   = localStorage.getItem(POPUP_KEY);
  const alreadyDone = localStorage.getItem(POPUP_DONE);
  const cooldown    = dismissed && (Date.now() - parseInt(dismissed)) < 7 * 24 * 60 * 60 * 1000;

  function openPopup() {
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePopup(permanent = false) {
    popup.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (permanent) {
      localStorage.setItem(POPUP_DONE, '1');
    } else {
      localStorage.setItem(POPUP_KEY, Date.now().toString());
    }
  }

  if (!cooldown && !alreadyDone) {
    setTimeout(openPopup, 5000);
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 10 && !popup.classList.contains('active') && !alreadyDone) {
        openPopup();
      }
    }, { once: true });
  }

  popupClose?.addEventListener('click', () => closePopup(false));
  popup?.addEventListener('click', (e) => { if (e.target === popup) closePopup(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) closePopup(false);
  });

  popupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    popupForm.style.display = 'none';
    popupSuccess.style.display = 'block';
    setTimeout(() => closePopup(true), 2800);
  });

});
