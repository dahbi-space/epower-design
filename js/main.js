/* ==========================================================================
   E-POWER MOTORS — HOMEPAGE INTERACTIONS
   Mobile nav toggle, image fallback, count-up stats, savings calculator.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initImageFallback();
  initCounters();
  initSavingsCalculator();
});

/* ===================== MOBILE NAV ===================== */
function initMobileNav() {
  const burger = document.getElementById('epBurger');
  const menu = document.getElementById('epMobileMenu');
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
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    if (img.complete) {
      if (img.naturalWidth === 0) hide(img);
    } else {
      img.addEventListener('error', () => hide(img), { once: true });
    }
  });
}

/* ===================== ANIMATED COUNTERS ===================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-dec') || '0', 10);
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
  const slider = document.getElementById('epKmSlider');
  if (!slider) return;

  const kmValue = document.getElementById('epKmValue');
  const essMonthly = document.getElementById('epEssMonthly');
  const essAnnual = document.getElementById('epEssAnnual');
  const elMonthly = document.getElementById('epElMonthly');
  const elAnnual = document.getElementById('epElAnnual');
  const savePct = document.getElementById('epSavePct');
  const saveAnnual = document.getElementById('epSaveAnnual');
  const saveMonthly = document.getElementById('epSaveMonthly');

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
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--ep-accent').trim() || '#F2C500';
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
