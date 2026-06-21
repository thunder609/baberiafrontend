import { $, $$, api, apiPost, rebuildContainer, localDateString, generateSlots, minutesSinceMidnight } from './utils.js';
import { state } from './state.js';
import { t, tn, currentLang } from './translations.js';

// ─── STEPPER ────────────────────────────────────────────────
export function showStep(n) {
  state.step = n;

  $$('.booking-panel').forEach((el) => {
    const isTarget = Number(el.dataset.step) === n;
    el.classList.toggle('hidden', !isTarget);
    if (isTarget) {
      el.classList.remove('slide-in');
      void el.offsetWidth;
      el.classList.add('slide-in');
    }
  });

  $$('.step-item').forEach((el) => {
    const s = Number(el.dataset.step);
    const circle = el.querySelector('.step-circle');
    const label = el.querySelector('.step-label');
    if (!circle || !label) return;

    circle.classList.toggle('step-circle--active', s === n);
    circle.classList.toggle('step-circle--done', s < n);
    label.classList.toggle('step-label--active', s === n);
    label.classList.toggle('step-label--done', s < n);
  });

  $$('.step-connector').forEach((el) => {
    const s = Number(el.dataset.connector);
    el.classList.toggle('step-connector--done', s < n);
  });

  const prev = $('#btn-prev');
  const next = $('#btn-next');
  prev.classList.toggle('hidden', n === 1);

  if (n === 5) {
    next.innerHTML = t('booking.submit');
  } else {
    next.innerHTML = t('booking.next');
  }

  hideFeedback();
}

export function goNext() {
  if (!validateStep(state.step)) return;
  showStep(state.step + 1);
}

export function goPrev() {
  showStep(state.step - 1);
}

// ─── FEEDBACK ────────────────────────────────────────────────
export function showFeedback(msg, type = 'error') {
  const el = $('#booking-feedback');
  el.classList.remove('hidden', 'border-red-200', 'bg-red-50', 'text-red-700', 'border-emerald-200', 'bg-emerald-50', 'text-emerald-700', 'border-amber-200', 'bg-amber-50', 'text-amber-700');
  el.classList.add(
    ...(
      type === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : type === 'warning'
          ? 'border-amber-200 bg-amber-50 text-amber-700'
          : 'border-red-200 bg-red-50 text-red-700'
    ).split(' ')
  );
  el.textContent = msg;
  el.classList.remove('hidden');
}

export function hideFeedback() {
  const el = $('#booking-feedback');
  el.classList.add('hidden');
}

// ─── STEP VALIDATION ────────────────────────────────────────
function totalDuration() {
  return state.selectedServices.reduce((sum, s) => sum + s.duration, 0);
}

function totalPrice() {
  return state.selectedServices.reduce((sum, s) => sum + s.price, 0);
}

function validateStep(step) {
  switch (step) {
    case 1:
      if (!state.selectedBarber) {
        showFeedback(t('validate.selectBarber'));
        return false;
      }
      return true;
    case 2:
      if (state.selectedServices.length === 0) {
        showFeedback(t('validate.selectService'));
        return false;
      }
      return true;
    case 3:
      if (!state.selectedDate) {
        showFeedback(t('validate.selectDate'));
        return false;
      }
      return true;
    case 4:
      if (!state.selectedTime) {
        showFeedback(t('validate.selectTime'));
        return false;
      }
      return true;
    case 5:
      if (!state.clientEmail.trim()) {
        showFeedback(t('validate.emailRequired'));
        return false;
      }
      if (!state.clientPhone.trim()) {
        showFeedback(t('validate.phoneRequired'));
        return false;
      }
      if (!state.clientName.trim()) {
        showFeedback(t('validate.nameRequired'));
        return false;
      }
      return true;
    default:
      return true;
  }
}

// ─── BOOKING: BUILD STEP 1 ──────────────────────────────────
export function buildBarberSelection() {
  const container = rebuildContainer('booking-barbers');
  container.innerHTML = state.barbers
    .map((b) => `
    <button
      class="barber-opt rounded-lg border-2 p-4 text-center transition hover:border-barber-accent hover:bg-amber-50"
      data-id="${b.id}"
    >
      <div class="mx-auto h-10 w-10 rounded-full bg-barber-accent/20 flex items-center justify-center text-sm font-bold text-barber-accent">
        ${b.name.charAt(0)}
      </div>
      <p class="mt-2 text-sm font-medium text-barber-dark">${b.name}</p>
    </button>
  `)
    .join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.barber-opt');
    if (!btn) return;
    state.selectedBarber = Number(btn.dataset.id);
    container.querySelectorAll('.barber-opt').forEach((b) => {
      b.classList.toggle('border-barber-accent', Number(b.dataset.id) === state.selectedBarber);
      b.classList.toggle('bg-amber-50', Number(b.dataset.id) === state.selectedBarber);
      b.classList.toggle('border-stone-200', Number(b.dataset.id) !== state.selectedBarber);
    });
    hideFeedback();
  });
}

// ─── BOOKING: BUILD STEP 2 ──────────────────────────────────
export function buildServiceSelection() {
  const container = rebuildContainer('booking-services');
  renderServices();

  container.addEventListener('click', (e) => {
    const card = e.target.closest('.service-opt');
    if (!card) return;
    const id = Number(card.dataset.id);
    const idx = state.selectedServices.findIndex((s) => s.id === id);

    if (idx === -1) {
      const svc = state.services.find((s) => s.id === id);
      state.selectedServices.push({ id, duration: svc.durationMinutes, name: svc.name, price: svc.price });
    } else {
      state.selectedServices.splice(idx, 1);
    }

    renderServices();
    hideFeedback();
  });

  function renderServices() {
    const selIds = new Set(state.selectedServices.map((s) => s.id));
    container.innerHTML = state.services
      .map((s) => {
        const checked = selIds.has(s.id);
        return `
        <div
          class="service-opt flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 text-left transition hover:border-barber-accent ${checked ? 'border-barber-accent bg-amber-50' : 'border-stone-200 bg-white'}"
          data-id="${s.id}"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-5 w-5 items-center justify-center rounded border-2 ${checked ? 'border-barber-accent bg-barber-accent' : 'border-stone-300'} transition">
              <i class="fa-solid fa-check text-[10px] ${checked ? 'text-white' : 'text-transparent'}"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-barber-dark">${s.name}</p>
              <p class="text-xs text-barber-muted">${s.description || ''} · ${s.durationMinutes} min</p>
            </div>
          </div>
          <span class="text-sm font-bold text-barber-accent">$${s.price}</span>
        </div>
      `;
      })
      .join('');

    let totalEl = document.getElementById('service-total');
    if (state.selectedServices.length > 0) {
      if (!totalEl) {
        totalEl = document.createElement('div');
        totalEl.id = 'service-total';
        totalEl.className = 'mt-4 rounded-lg bg-barber-accent/10 p-3 text-center text-sm';
        container.after(totalEl);
      }
      totalEl.innerHTML = `<strong>${tn('booking.service', state.selectedServices.length)}</strong> · ${totalDuration()} min total · <strong class="text-barber-accent">$${totalPrice()}</strong>`;
      totalEl.classList.remove('hidden');
    } else if (totalEl) {
      totalEl.classList.add('hidden');
    }
  }
}

// ─── BOOKING: BUILD STEP 3 ──────────────────────────────────
export function buildDatePicker() {
  const input = $('#booking-date');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  input.min = localDateString(tomorrow);
  input.value = '';
  input.focus();

  input.addEventListener('change', () => {
    state.selectedDate = input.value;
    state.selectedTime = '';
    hideFeedback();
  });
}

// ─── BOOKING: BUILD STEP 4 ──────────────────────────────────
export async function buildTimeSlots() {
  const container = $('#time-slots');
  const feedback = $('#time-feedback');

  if (!state.selectedDate || !state.selectedBarber || state.selectedServices.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center text-xs text-barber-muted">${t('booking.missingData')}</p>`;
    return;
  }

  state.selectedTime = '';
  container.innerHTML = Array.from({ length: 8 }, () =>
    '<div class="skeleton-light rounded-lg" style="height: 44px;"></div>'
  ).join('');

  try {
    const date = new Date(state.selectedDate + 'T12:00:00');
    const dayOfWeek = date.getDay();

    const schedules = await api(`/api/barbers/${state.selectedBarber}/schedules`);
    const daySchedule = schedules.find((s) => s.dayOfWeek === dayOfWeek);

    if (!daySchedule) {
      container.innerHTML = `<p class="col-span-full text-center text-xs text-amber-700"><i class="fa-regular fa-calendar-xmark mr-1"></i>${t('booking.notWorking')}</p>`;
      return;
    }

    const overrides = await api(`/api/barbers/${state.selectedBarber}/overrides`);
    const dayOverride = overrides.find((o) => o.date === state.selectedDate);

    const scheduleStart = minutesSinceMidnight(daySchedule.startTime);
    const scheduleEnd = minutesSinceMidnight(daySchedule.endTime);

    let availStart = scheduleStart;
    let availEnd = scheduleEnd;

    if (dayOverride) {
      const overrideStart = minutesSinceMidnight(dayOverride.startTime);
      const overrideEnd = minutesSinceMidnight(dayOverride.endTime);
      if (dayOverride.available) {
        availStart = Math.min(availStart, overrideStart);
        availEnd = Math.max(availEnd, overrideEnd);
      } else {
        const blockStart = Math.max(availStart, overrideStart);
        const blockEnd = Math.min(availEnd, overrideEnd);
        if (blockStart < blockEnd) {
          if (blockStart > availStart && blockEnd < availEnd) {
            const firstHalf = blockStart - availStart;
            const secondHalf = availEnd - blockEnd;
            if (firstHalf >= secondHalf) {
              availEnd = blockStart;
            } else {
              availStart = blockEnd;
            }
          } else if (blockStart <= availStart) {
            availStart = blockEnd;
          } else {
            availEnd = blockStart;
          }
        }
      }
    }

    const appointments = await api(`/api/appointments?barberId=${state.selectedBarber}&startDate=${state.selectedDate}&endDate=${state.selectedDate}`);

    const takenMinutes = appointments.map((a) => ({
      start: minutesSinceMidnight(a.startTime.slice(11, 16)),
      end: minutesSinceMidnight(a.endTime.slice(11, 16)),
    }));

    const allSlots = generateSlots(availStart, availEnd, totalDuration());

    const takenSet = new Set();
    takenMinutes.forEach((t) => {
      allSlots.forEach((slot) => {
        if (slot.start < t.end && t.start < slot.end) {
          takenSet.add(slot.label);
        }
      });
    });

    container.innerHTML = allSlots
      .map((slot) => {
        const taken = takenSet.has(slot.label);
        const isSelected = state.selectedTime === slot.label && !taken;
        return `
      <button
        class="time-slot rounded-lg border-2 px-3 py-2 text-center text-sm font-medium transition ${taken ? 'border-stone-100 bg-stone-50 text-stone-300 line-through cursor-not-allowed' : isSelected ? 'border-barber-accent bg-barber-accent text-white' : 'border-stone-200 text-barber-dark hover:border-barber-accent hover:bg-amber-50'}"
        data-start="${slot.label}"
        ${taken ? 'disabled' : ''}
      >
        ${taken ? t('booking.occupied') : slot.label}
      </button>
    `;
      })
      .join('');

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.time-slot');
      if (!btn || btn.disabled) return;
      state.selectedTime = btn.dataset.start;
      container.querySelectorAll('.time-slot').forEach((b) => {
        const taken = b.disabled;
        const selected = b.dataset.start === state.selectedTime;
        b.className = `time-slot rounded-lg border-2 px-3 py-2 text-center text-sm font-medium transition ${taken ? 'border-stone-100 bg-stone-50 text-stone-300 line-through cursor-not-allowed' : selected ? 'border-barber-accent bg-barber-accent text-white' : 'border-stone-200 text-barber-dark hover:border-barber-accent hover:bg-amber-50'}`;
      });
      hideFeedback();
    });

    const free = allSlots.length - takenSet.size;
    if (free === 0) {
      feedback.innerHTML = `<span class="text-amber-700"><i class="fa-regular fa-clock mr-1"></i>${t('booking.noSlots')}</span>`;
    } else {
      feedback.textContent = tn('booking.slotsAvailable', free);
    }
  } catch (e) {
    container.innerHTML = `<p class="col-span-full text-center text-xs text-red-500">${t('booking.error')}</p>`;
    console.error(e);
  }
}

// ─── SUBMIT ─────────────────────────────────────────────────
export async function submitBooking() {
  if (!validateStep(5)) return;

  const btn = $('#btn-next');
  const btnText = btn.innerHTML;
  btn.disabled = true;
  btn.className = 'rounded-md bg-amber-500 px-6 py-2 text-sm font-semibold text-white transition cursor-wait';
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> ${t('booking.reserving')}`;

  try {
    let clientId;
    const existing = await api('/api/clients');
    const match = existing.find(
      (c) => c.phone === state.clientPhone.trim() || c.email === state.clientEmail.trim()
    );
    if (match) {
      clientId = match.id;
    } else {
      const newClient = await apiPost('/api/clients', {
        name: state.clientName.trim(),
        phone: state.clientPhone.trim(),
        email: state.clientEmail.trim() || `${state.clientPhone.trim()}@placeholder.com`,
      });
      clientId = newClient.id;
    }

    const startTime = `${state.selectedDate}T${state.selectedTime}:00`;
    const duration = totalDuration();
    const [h, m] = state.selectedTime.split(':').map(Number);
    const endMinutes = h * 60 + m + duration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTime = `${state.selectedDate}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

    const primary = state.selectedServices[0];
    const extras = state.selectedServices.slice(1).map((s) => s.name).join(' + ');
    const notes = extras
      ? `Reserva desde landing: ${state.selectedServices.map((s) => s.name).join(' + ')}`
      : 'Reserva desde landing';

    await apiPost('/api/appointments', {
      barberId: state.selectedBarber,
      clientId,
      serviceId: primary.id,
      startTime,
      endTime,
      notes,
    });

    showFeedback(t('booking.success'), 'success');
    btn.disabled = true;
    btn.className = 'rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition';
    btn.innerHTML = `<i class="fa-regular fa-circle-check mr-1"></i> ${t('booking.reserved')}`;

    setTimeout(() => {
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
      $$('.barber-opt').forEach((b) => {
        b.classList.remove('border-barber-accent', 'bg-amber-50');
        b.classList.add('border-stone-200');
      });
      buildServiceSelection();
      btn.disabled = false;
      btn.className = 'rounded-md bg-barber-accent px-6 py-2 text-sm font-semibold text-white transition hover:bg-amber-600';
      btn.innerHTML = btnText;
      showStep(1);
    }, 5000);
  } catch (e) {
    showFeedback(e.message || t('booking.submitError'), 'error');
    btn.disabled = false;
    btn.className = 'rounded-md bg-barber-accent px-6 py-2 text-sm font-semibold text-white transition hover:bg-amber-600';
    btn.innerHTML = btnText;
  }
}

// ─── STEP OBSERVER ──────────────────────────────────────────
export function initStepObserver() {
  const observer = new MutationObserver(() => {
    const panel4 = document.querySelector('.booking-panel[data-step="4"]');
    if (panel4 && !panel4.classList.contains('hidden')) {
      buildTimeSlots();
    }

    const panel5 = document.querySelector('.booking-panel[data-step="5"]');
    if (panel5 && !panel5.classList.contains('hidden')) {
      $('#field-name').value = state.clientName;
      $('#field-phone').value = state.clientPhone;
      $('#field-email').value = state.clientEmail;

      const barber = state.barbers.find((b) => b.id === state.selectedBarber);
      const summary = $('#booking-summary');
      const dateObj = new Date(state.selectedDate + 'T12:00:00');
      const locale = currentLang === 'en' ? 'en-US' : 'es-AR';
      const dateStr = dateObj.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const serviceList = state.selectedServices.map((s) => `<div class="flex justify-between"><span>${s.name}</span><span class="font-medium text-barber-accent">$${s.price}</span></div>`).join('');
      summary.innerHTML = `
        <div class="flex items-center gap-2 text-barber-dark"><i class="fa-solid fa-user text-barber-accent text-xs"></i><span class="font-medium">${barber ? barber.name : t('booking.barberFallback')}</span></div>
        <div class="flex items-center gap-2 text-barber-dark"><i class="fa-regular fa-calendar text-barber-accent text-xs"></i>${dateStr} — <strong>${state.selectedTime}</strong></div>
        <div class="border-t border-stone-200 pt-2 mt-2 ${state.selectedServices.length > 1 ? '' : 'hidden'}">
          ${serviceList}
        </div>
        <div class="flex justify-between border-t border-stone-200 pt-2 font-semibold text-barber-dark">
          <span>${t('booking.total')}</span>
          <span class="text-barber-accent">$${totalPrice()} · ${totalDuration()} min</span>
        </div>
      `;
    }
  });

  $$('.booking-panel').forEach((el) => {
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
  });
}
