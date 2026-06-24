import './style.css';
import './nav.js';
import './hero.js';

import { t, initLanguage, setLanguage, applyTranslations, currentLang } from './translations.js';
import { $, api } from './utils.js';
import { state, WHATSAPP_NUMBER } from './state.js';
import { loadServices, renderServicesGrid } from './services.js';
import { loadBarbers, renderBarbersGrid } from './barbers.js';
import { showStep, goNext, goPrev, hideFeedback, buildBarberSelection, buildServiceSelection, buildDatePicker, submitBooking, initStepObserver } from './booking.js';
import { initReveal } from './reveal.js';

// ─── CHANGE LANGUAGE ────────────────────────────────────────
function changeLanguage(lang) {
  setLanguage(lang);
  applyTranslations();
  document.querySelectorAll('[data-lang-toggle]').forEach((el) => {
    el.textContent = t('nav.langToggle');
  });
  renderServicesGrid();
  renderBarbersGrid();
  state.selectedBarber = null;
  state.selectedServices = [];
  state.selectedDate = '';
  state.selectedTime = '';
  state.clientName = '';
  state.clientPhone = '';
  state.clientEmail = '';
  $('#field-name').value = '';
  $('#field-phone').value = '';
  $('#field-email').value = '';
  $('#booking-date').value = '';
  const totalEl = document.getElementById('service-total');
  if (totalEl) totalEl.remove();
  $('#booking-summary').innerHTML = '';
  buildBarberSelection();
  buildServiceSelection();
  hideFeedback();
  showStep(1);
  initReveal();
}

// ─── CLIENT LOOKUP ──────────────────────────────────────────
async function lookupClient() {
  const phone = $('#field-phone').value.trim();
  const email = $('#field-email').value.trim();
  if (!phone && !email) return;

  try {
    const clients = await api('/api/clients');
    const match = phone
      ? clients.find((c) => c.phone === phone)
      : clients.find((c) => c.email === email);

    if (match) {
      $('#field-name').value = match.name;
      state.clientName = match.name;
      if (phone) {
        $('#field-email').value = match.email || '';
        state.clientEmail = match.email || '';
      }
      if (email && !phone) {
        $('#field-phone').value = match.phone || '';
        state.clientPhone = match.phone || '';
      }
      const feedback = $('#booking-feedback');
      feedback.className = 'mt-4 rounded-lg border p-3 text-sm border-emerald-200 bg-emerald-50 text-emerald-700';
      feedback.textContent = t('booking.welcomeBack', { name: match.name });
      feedback.classList.remove('hidden');
    } else {
      hideFeedback();
    }
  } catch (e) {
    // Silently ignore lookup errors
  }
}

// ─── BOOT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initLanguage();
  applyTranslations();
  document.querySelectorAll('[data-lang-toggle]').forEach((el) => {
    el.textContent = t('nav.langToggle');
    el.addEventListener('click', () => {
      changeLanguage(currentLang === 'es' ? 'en' : 'es');
    });
  });

  await Promise.all([loadServices(), loadBarbers()]);

  // Set WhatsApp link
  const waLink = $('#whatsapp-float');
  if (waLink) {
    waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, quisiera reservar un turno')}`;
  }

  // Back to top
  const backToTop = $('#back-to-top');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('opacity-0', window.scrollY < 400);
    backToTop.classList.toggle('pointer-events-none', window.scrollY < 400);
  });

  buildBarberSelection();
  buildServiceSelection();
  buildDatePicker();

  $('#field-email').addEventListener('blur', lookupClient);
  $('#field-phone').addEventListener('blur', lookupClient);

  $('#btn-next').addEventListener('click', () => {
    if (state.step === 4) {
      state.clientName = $('#field-name').value;
      state.clientPhone = $('#field-phone').value;
      state.clientEmail = $('#field-email').value;
      submitBooking();
    } else {
      goNext();
    }
  });

  $('#btn-prev').addEventListener('click', () => {
    if (state.step === 4) {
      state.clientName = $('#field-name').value;
      state.clientPhone = $('#field-phone').value;
      state.clientEmail = $('#field-email').value;
    }
    goPrev();
  });

  initStepObserver();
  initReveal();
  showStep(1);
});
