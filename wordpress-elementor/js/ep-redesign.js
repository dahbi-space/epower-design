/* ==========================================================================
   E-POWER MOTORS — HOMEPAGE INTERACTIONS (Elementor / WordPress build)
   Mobile nav toggle, image fallback, count-up stats, savings calculator.
   Plain vanilla JS, no build step, no dependencies. Wrapped in an IIFE so
   nothing leaks onto window — safe to enqueue alongside theme/plugin
   scripts and Elementor's own JS.

   INSTALL: paste this whole file into a WPCode "JS Snippet", location
   "Site Wide Footer" (Insert Method "Insert Before </body>" or Auto
   Insert Footer) — see wordpress-elementor/README.md. All DOM hooks are
   ID/data-attribute selectors scoped to the ep-redesign- namespace, so
   this is safe to load on every page even if a given section isn't
   present (each init function no-ops when its elements are missing).
   ========================================================================== */
(function () {
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initImageFallback();
  initCounters();
  initSavingsCalculator();
});

/* ===================== MOBILE NAV ===================== */
function initMobileNav() {
  const burger = document.getElementById('ep-redesign-burger');
  const menu = document.getElementById('ep-redesign-mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ===================== IMAGE FALLBACK ===================== */
/* Placeholder <img> sources 404 until real WordPress media URLs are swapped
   in; hide the broken image so the decorative pattern + label behind it
   stays visible instead of a broken-image icon. Checks img.complete first
   since a fast 404 can resolve (and fire "error") before this script runs. */
function initImageFallback() {
  const hide = (img) => { img.style.display = 'none'; };
  document.querySelectorAll('img[data-ep-redesign-fallback]').forEach((img) => {
    if (img.complete) {
      if (img.naturalWidth === 0) hide(img);
    } else {
      img.addEventListener('error', () => hide(img), { once: true });
    }
  });
}

/* ===================== ANIMATED COUNTERS ===================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-ep-redesign-counter]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-ep-redesign-target'));
    const decimals = parseInt(el.getAttribute('data-ep-redesign-dec') || '0', 10);
    const duration = 1400;
    const start = performance.now();
    const format = (value) => decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('fr-FR');

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => observer.observe(el));
  } else {
    counters.forEach(animate);
  }
}

/* ===================== SAVINGS CALCULATOR ===================== */
function initSavingsCalculator() {
  const slider = document.getElementById('ep-redesign-km-slider');
  if (!slider) return;

  const kmValue = document.getElementById('ep-redesign-km-value');
  const essMonthly = document.getElementById('ep-redesign-ess-monthly');
  const essAnnual = document.getElementById('ep-redesign-ess-annual');
  const elMonthly = document.getElementById('ep-redesign-el-monthly');
  const elAnnual = document.getElementById('ep-redesign-el-annual');
  const savePct = document.getElementById('ep-redesign-save-pct');
  const saveAnnual = document.getElementById('ep-redesign-save-annual');
  const saveMonthly = document.getElementById('ep-redesign-save-monthly');

  const DAYS_PER_MONTH = 30;
  const FUEL_CONSUMPTION_PER_100KM = 2.8; // litres
  const FUEL_PRICE_PER_LITRE = 14.8;      // DH
  const ENERGY_CONSUMPTION_PER_100KM = 3.5; // kWh
  const ENERGY_PRICE_PER_KWH = 1.3;         // DH

  const formatDH = (amount) => Math.round(amount).toLocaleString('fr-FR') + ' DH';

  const paintSliderTrack = () => {
    const min = Number(slider.min);
    const max = Number(slider.max);
    const pct = ((Number(slider.value) - min) / (max - min)) * 100;
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--ep-redesign-accent').trim() || '#F2C500';
    slider.style.background = `linear-gradient(90deg, ${accent} 0%, ${accent} ${pct}%, #26262C ${pct}%, #26262C 100%)`;
  };

  const update = () => {
    const km = Number(slider.value);
    const fuelCost = km * DAYS_PER_MONTH * (FUEL_CONSUMPTION_PER_100KM / 100) * FUEL_PRICE_PER_LITRE;
    const electricCost = km * DAYS_PER_MONTH * (ENERGY_CONSUMPTION_PER_100KM / 100) * ENERGY_PRICE_PER_KWH;
    const pct = Math.round((1 - electricCost / fuelCost) * 100);

    kmValue.textContent = km;
    essMonthly.textContent = formatDH(fuelCost);
    essAnnual.textContent = formatDH(fuelCost * 12);
    elMonthly.textContent = formatDH(electricCost);
    elAnnual.textContent = formatDH(electricCost * 12);
    savePct.textContent = pct + '%';
    saveAnnual.textContent = formatDH((fuelCost - electricCost) * 12);
    saveMonthly.textContent = formatDH(fuelCost - electricCost);

    paintSliderTrack();
  };

  slider.addEventListener('input', update);
  update();
}

})();
