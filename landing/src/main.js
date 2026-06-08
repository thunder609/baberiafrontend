import './style.css';

// ─── MOBILE NAV (runs immediately — module scripts are deferred) ──
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!navToggle || !mobileMenu) return;

  const mobileIcon = navToggle.querySelector('i');

  function openNav() {
    mobileMenu.style.display = '';
    if (mobileIcon) mobileIcon.className = 'fa-solid fa-xmark text-lg pointer-events-none';
    navToggle.setAttribute('aria-label', 'Cerrar menú');
  }

  function closeNav() {
    mobileMenu.style.display = 'none';
    if (mobileIcon) mobileIcon.className = 'fa-solid fa-bars text-lg pointer-events-none';
    navToggle.setAttribute('aria-label', 'Abrir menú');
  }

  navToggle.addEventListener('click', () => {
    if (mobileMenu.style.display === 'none') openNav();
    else closeNav();
  });

  document.querySelectorAll('.nav-mobile-link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
});

// ─── HERO LAZY LOAD ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const bg = document.getElementById('hero-bg');
  if (!bg) return;
  const img = new Image();
  img.onload = () => {
    bg.style.backgroundImage = "url('https://images.unsplash.com/photo-1585747861115-7fb8e36ab164?q=80&w=2070&auto=format&fit=crop')";
    bg.classList.add('loaded');
  };
  img.src = 'https://images.unsplash.com/photo-1585747861115-7fb8e36ab164?q=80&w=2070&auto=format&fit=crop';
});

// ─── STATE ──────────────────────────────────────────────────
const state = {
  barbers: [],
  services: [],
  step: 1,

  selectedBarber: null,
  selectedServices: [], // array of { id, duration, name, price }
  selectedDate: '',
  selectedTime: '',

  clientName: '',
  clientPhone: '',
  clientEmail: '',
};

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ─── DOM REFS ───────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── HELPERS ────────────────────────────────────────────────
async function api(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.errors?.join(', ') || `Error ${res.status}`);
  }
  return res.json();
}

function localDateString(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Generate 30-min slots from start to end */
function generateSlots(start, end, duration = 30) {
  const slots = [];
  let current = start;
  while (current < end) {
    const slotEnd = current + duration;
    if (slotEnd <= end) {
      slots.push({
        start: current,
        end: slotEnd,
        label: `${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`,
      });
    }
    current += duration;
  }
  return slots;
}

function minutesSinceMidnight(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// ─── STEPPER ────────────────────────────────────────────────
function showStep(n) {
  state.step = n;

  // Update panels with slide animation
  $$('.booking-panel').forEach((el) => {
    const isTarget = Number(el.dataset.step) === n;
    el.classList.toggle('hidden', !isTarget);
    if (isTarget) {
      el.classList.remove('slide-in');
      // Force reflow, then add animation
      void el.offsetWidth;
      el.classList.add('slide-in');
    }
  });

  // Update step indicator (circles + connectors)
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

  // Update connectors
  $$('.step-connector').forEach((el) => {
    const s = Number(el.dataset.connector);
    el.classList.toggle('step-connector--done', s < n);
  });

  // Prev / Next buttons
  const prev = $('#btn-prev');
  const next = $('#btn-next');
  prev.classList.toggle('hidden', n === 1);

  if (n === 5) {
    next.innerHTML = 'Reservar turno';
  } else {
    next.innerHTML = 'Siguiente';
  }

  // Clear feedback on step change
  hideFeedback();
}

function goNext() {
  if (!validateStep(state.step)) return;
  showStep(state.step + 1);
}

function goPrev() {
  showStep(state.step - 1);
}

// ─── FEEDBACK ────────────────────────────────────────────────
function showFeedback(msg, type = 'error') {
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

function hideFeedback() {
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
        showFeedback('Seleccioná un barbero para continuar.');
        return false;
      }
      return true;
    case 2:
      if (state.selectedServices.length === 0) {
        showFeedback('Seleccioná al menos un servicio para continuar.');
        return false;
      }
      return true;
    case 3:
      if (!state.selectedDate) {
        showFeedback('Seleccioná una fecha para continuar.');
        return false;
      }
      return true;
    case 4:
      if (!state.selectedTime) {
        showFeedback('Seleccioná un horario para continuar.');
        return false;
      }
      return true;
    case 5:
      if (!state.clientEmail.trim()) {
        showFeedback('Necesitamos tu email para contactarte.');
        return false;
      }
      if (!state.clientPhone.trim()) {
        showFeedback('Necesitamos tu teléfono por si hay que confirmar.');
        return false;
      }
      if (!state.clientName.trim()) {
        showFeedback('Decinos tu nombre para agendar el turno.');
        return false;
      }
      return true;
    default:
      return true;
  }
}

// ─── POPULATE GRIDS ─────────────────────────────────────────
const SERVICE_ICONS = {
  'corte': 'fa-scissors',
  'corte+': 'fa-scissors',
  'barba': 'fa-face-shave',
  'afeitado': 'fa-regular fa-face-smile',
  'cejas': 'fa-regular fa-eye',
  'tinte': 'fa-palette',
  'perfilado': 'fa-regular fa-hand-peace',
};

const SERVICE_COLORS = [
  'bg-amber-50 text-amber-600',
  'bg-orange-50 text-orange-600',
  'bg-yellow-50 text-yellow-600',
  'bg-rose-50 text-rose-600',
  'bg-violet-50 text-violet-600',
  'bg-teal-50 text-teal-600',
];

function serviceIcon(name) {
  const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [kw, icon] of Object.entries(SERVICE_ICONS)) {
    if (key.includes(kw)) return icon;
  }
  return 'fa-cut';
}

async function loadServices() {
  try {
    state.services = await api('/api/services?onlyActive=true');
    const grid = $('#services-grid');
    if (state.services.length === 0) {
      grid.innerHTML = '<p class="col-span-full text-center text-sm text-barber-muted">Próximamente más servicios.</p>';
      return;
    }
    grid.innerHTML = state.services
      .map((s, i) => {
        const icon = serviceIcon(s.name);
        const color = SERVICE_COLORS[i % SERVICE_COLORS.length];
        const delay = Math.min(100 + i * 100, 600);
        return `
      <div class="service-card reveal reveal-up delay-${delay} rounded-xl border border-stone-200 bg-white p-6 text-center shadow-sm cursor-default">
        <div class="service-icon mx-auto flex h-14 w-14 items-center justify-center rounded-full ${color}">
          <i class="fa-solid ${icon} text-xl"></i>
        </div>
        <h3 class="mt-4 font-serif text-lg font-semibold text-barber-dark">${s.name}</h3>
        <p class="mt-1 text-sm text-barber-muted">${s.description || ''}</p>
        <div class="mt-4 flex items-center justify-center gap-2">
          <span class="text-2xl font-bold text-barber-accent">$${s.price}</span>
          <span class="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-barber-muted">${s.durationMinutes} min</span>
        </div>
      </div>
    `;
      })
      .join('');
  } catch (e) {
    $('#services-grid').innerHTML = '<p class="col-span-full text-center text-sm text-barber-muted">Error al cargar los servicios. ¿El backend está corriendo?</p>';
  }
}

async function loadBarbers() {
  try {
    state.barbers = await api('/api/barbers?onlyActive=true');
    const grid = $('#barbers-grid');
    if (state.barbers.length === 0) {
      grid.innerHTML = '<p class="col-span-full text-center text-sm text-stone-400">Próximamente nuevos barberos.</p>';
      return;
    }
    grid.innerHTML = state.barbers
      .map(
        (b, i) => {
          const delay = Math.min(100 + i * 100, 600);
          return `
      <div class="barber-card reveal reveal-up delay-${delay} text-center">
        <div class="barber-avatar mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-stone-700">
          <div class="flex h-full items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900 text-4xl font-bold text-barber-accent">
            ${b.name.charAt(0)}
          </div>
        </div>
        <h3 class="mt-4 font-serif text-lg font-semibold text-white">${b.name}</h3>
        <p class="text-sm text-stone-400">Barbero profesional</p>
        <a href="#turnos" class="barber-cta mt-4 inline-block rounded-md border border-barber-accent/40 px-5 py-2 text-xs font-medium text-barber-accent transition hover:bg-barber-accent hover:text-white">
          <i class="fa-regular fa-calendar-check mr-1"></i>Reservá con ${b.name.split(' ')[0]}
        </a>
      </div>
    `;
        }
      )
      .join('');
  } catch (e) {
    $('#barbers-grid').innerHTML = '<p class="col-span-full text-center text-sm text-stone-400">Error al cargar los barberos. ¿El backend está corriendo?</p>';
  }
}

// ─── BOOKING: BUILD STEP 1 ──────────────────────────────────
function buildBarberSelection() {
  const container = $('#booking-barbers');
  container.innerHTML = state.barbers
    .map(
      (b) => `
    <button
      class="barber-opt rounded-lg border-2 p-4 text-center transition hover:border-barber-accent hover:bg-amber-50"
      data-id="${b.id}"
    >
      <div class="mx-auto h-10 w-10 rounded-full bg-barber-accent/20 flex items-center justify-center text-sm font-bold text-barber-accent">
        ${b.name.charAt(0)}
      </div>
      <p class="mt-2 text-sm font-medium text-barber-dark">${b.name}</p>
    </button>
  `
    )
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
function buildServiceSelection() {
  const container = $('#booking-services');
  renderServices();

  container.addEventListener('click', (e) => {
    const card = e.target.closest('.service-opt');
    if (!card) return;
    const id = Number(card.dataset.id);
    const idx = state.selectedServices.findIndex((s) => s.id === id);

    if (idx === -1) {
      // Add
      const svc = state.services.find((s) => s.id === id);
      state.selectedServices.push({ id, duration: svc.durationMinutes, name: svc.name, price: svc.price });
    } else {
      // Remove
      state.selectedServices.splice(idx, 1);
    }

    renderServices();
    hideFeedback();
  });

  function renderServices() {
    const selIds = new Set(state.selectedServices.map((s) => s.id));
    container.innerHTML = state.services
      .map(
        (s) => {
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
        }
      )
      .join('');

    // Update total bar
    let totalEl = document.getElementById('service-total');
    if (state.selectedServices.length > 0) {
      if (!totalEl) {
        totalEl = document.createElement('div');
        totalEl.id = 'service-total';
        totalEl.className = 'mt-4 rounded-lg bg-barber-accent/10 p-3 text-center text-sm';
        container.after(totalEl);
      }
      totalEl.innerHTML = `<strong>${state.selectedServices.length} servicio${state.selectedServices.length !== 1 ? 's' : ''}</strong> · ${totalDuration()} min total · <strong class="text-barber-accent">$${totalPrice()}</strong>`;
      totalEl.classList.remove('hidden');
    } else if (totalEl) {
      totalEl.classList.add('hidden');
    }
  }
}

// ─── BOOKING: BUILD STEP 3 ──────────────────────────────────
function buildDatePicker() {
  const input = $('#booking-date');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  input.min = localDateString(tomorrow);
  input.value = '';
  input.focus();

  input.addEventListener('change', () => {
    state.selectedDate = input.value;
    state.selectedTime = ''; // reset time when date changes
    hideFeedback();
  });
}

// ─── BOOKING: BUILD STEP 4 (dynamic, built on enter) ────────
async function buildTimeSlots() {
  const container = $('#time-slots');
  const feedback = $('#time-feedback');

  if (!state.selectedDate || !state.selectedBarber || state.selectedServices.length === 0) {
    container.innerHTML = '<p class="col-span-full text-center text-xs text-barber-muted">Faltan datos para calcular horarios.</p>';
    return;
  }

  state.selectedTime = '';
  container.innerHTML = Array.from({ length: 8 }, () =>
    '<div class="skeleton-light rounded-lg" style="height: 44px;"></div>'
  ).join('');

  try {
    // 1. Get schedules for that day of week
    const date = new Date(state.selectedDate + 'T12:00:00');
    const dayOfWeek = date.getDay(); // 0=Sun

    const schedules = await api(`/api/barbers/${state.selectedBarber}/schedules`);
    const daySchedule = schedules.find((s) => s.dayOfWeek === dayOfWeek);

    if (!daySchedule) {
      container.innerHTML = '<p class="col-span-full text-center text-xs text-amber-700"><i class="fa-regular fa-calendar-xmark mr-1"></i>El barbero no trabaja este día. Elegí otra fecha.</p>';
      return;
    }

    // 2. Get overrides for this date
    const overrides = await api(`/api/barbers/${state.selectedBarber}/overrides`);
    const dayOverride = overrides.find((o) => o.date === state.selectedDate);

    // Determine effective hours
    const scheduleStart = minutesSinceMidnight(daySchedule.startTime);
    const scheduleEnd = minutesSinceMidnight(daySchedule.endTime);

    let availStart = scheduleStart;
    let availEnd = scheduleEnd;

    if (dayOverride) {
      const overrideStart = minutesSinceMidnight(dayOverride.startTime);
      const overrideEnd = minutesSinceMidnight(dayOverride.endTime);
      if (dayOverride.available) {
        // Override opens extra hours — take the union
        availStart = Math.min(availStart, overrideStart);
        availEnd = Math.max(availEnd, overrideEnd);
      } else {
        // Override blocks — remove the blocked range
        // Only the overlap between override and schedule is blocked
        const blockStart = Math.max(availStart, overrideStart);
        const blockEnd = Math.min(availEnd, overrideEnd);
        if (blockStart < blockEnd) {
          // Two ranges: availStart-blockStart and blockEnd-availEnd
          // For simplicity, take the larger one if one is empty
          if (blockStart > availStart && blockEnd < availEnd) {
            // Override splits the day — take the longer half
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

    // 3. Get existing appointments
    const appointments = await api(`/api/appointments?barberId=${state.selectedBarber}&startDate=${state.selectedDate}&endDate=${state.selectedDate}`);

    const takenMinutes = appointments.map((a) => ({
      start: minutesSinceMidnight(a.startTime.slice(11, 16)),
      end: minutesSinceMidnight(a.endTime.slice(11, 16)),
    }));

    // 4. Generate slots based on total duration of all selected services
    const allSlots = generateSlots(availStart, availEnd, totalDuration());

    // Show ALL slots, mark taken as "ocupado"
    const takenSet = new Set();
    takenMinutes.forEach((t) => {
      allSlots.forEach((slot) => {
        if (slot.start < t.end && t.start < slot.end) {
          takenSet.add(slot.label);
        }
      });
    });

    const hasAvailable = allSlots.some((slot) => !takenSet.has(slot.label));

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
        ${taken ? 'Ocupado' : slot.label}
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
      feedback.innerHTML = '<span class="text-amber-700"><i class="fa-regular fa-clock mr-1"></i>Completo — no hay turnos disponibles para este día.</span>';
    } else {
      feedback.textContent = `${free} turno${free !== 1 ? 's' : ''} disponible${free !== 1 ? 's' : ''}`;
    }
  } catch (e) {
    container.innerHTML = '<p class="col-span-full text-center text-xs text-red-500">Error al calcular horarios.</p>';
    console.error(e);
  }
}

// ─── SUBMIT ─────────────────────────────────────────────────
async function submitBooking() {
  if (!validateStep(5)) return;

  const btn = $('#btn-next');
  const btnText = btn.innerHTML;
  btn.disabled = true;
  btn.className = 'rounded-md bg-amber-500 px-6 py-2 text-sm font-semibold text-white transition cursor-wait';
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Reservando…';

  try {
    // 1. Find or create client
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

    // 2. Create appointment
    const startTime = `${state.selectedDate}T${state.selectedTime}:00`;
    const duration = totalDuration();
    const [h, m] = state.selectedTime.split(':').map(Number);
    const endMinutes = h * 60 + m + duration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTime = `${state.selectedDate}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

    // Primary service is the first one selected; list all in notes
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

    // Success!
    showFeedback('¡Turno reservado con éxito! Te esperamos.', 'success');
    btn.disabled = true;
    btn.className = 'rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition';
    btn.innerHTML = '<i class="fa-regular fa-circle-check mr-1"></i> ¡Reservado!';

    // Reset after 5 seconds
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
      // Remove total display
      const totalEl = document.getElementById('service-total');
      if (totalEl) totalEl.remove();
      // Reset all selections visually
      $$('.barber-opt').forEach((b) => {
        b.classList.remove('border-barber-accent', 'bg-amber-50');
        b.classList.add('border-stone-200');
      });
      // Re-render services to reset checkboxes
      buildServiceSelection();
      btn.disabled = false;
      btn.className = 'rounded-md bg-barber-accent px-6 py-2 text-sm font-semibold text-white transition hover:bg-amber-600';
      btn.innerHTML = btnText;
      showStep(1);
    }, 5000);
  } catch (e) {
    showFeedback(e.message || 'Error al reservar. Intentalo de nuevo.', 'error');
    btn.disabled = false;
    btn.className = 'rounded-md bg-barber-accent px-6 py-2 text-sm font-semibold text-white transition hover:bg-amber-600';
    btn.innerHTML = btnText;
  }
}

// ─── WIRING ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Load data in parallel
  await Promise.all([loadServices(), loadBarbers()]);

  // Build booking widgets
  buildBarberSelection();
  buildServiceSelection();
  buildDatePicker();

  // Wiring
  // ─── CLIENT LOOKUP (auto-fill when email/phone matches existing) ──
  async function lookupClient() {
    const email = $('#field-email').value.trim();
    const phone = $('#field-phone').value.trim();
    if (!email && !phone) return;

    try {
      const clients = await api('/api/clients');
      // Priority: email match > phone match
      const match = email
        ? clients.find((c) => c.email === email)
        : clients.find((c) => c.phone === phone);

      const nameField = $('#field-name');
      const phoneField = $('#field-phone');

      if (match) {
        nameField.value = match.name;
        state.clientName = match.name;
        // If found by email, also fill phone
        if (email && match.phone) {
          phoneField.value = match.phone;
          state.clientPhone = match.phone;
        }
        state.clientEmail = match.email;
        // Show greeting
        const feedback = $('#booking-feedback');
        feedback.className = 'mt-4 rounded-lg border p-3 text-sm border-emerald-200 bg-emerald-50 text-emerald-700';
        feedback.textContent = `¡Bienvenido de vuelta, ${match.name}!`;
        feedback.classList.remove('hidden');
      } else {
        // No match — if user changed data, clear only name
        nameField.value = '';
        hideFeedback();
      }
    } catch (e) {
      // Silently ignore lookup errors
    }
  }

  $('#field-email').addEventListener('blur', lookupClient);
  $('#field-phone').addEventListener('blur', lookupClient);

  $('#btn-next').addEventListener('click', () => {
    if (state.step === 5) {
      state.clientName = $('#field-name').value;
      state.clientPhone = $('#field-phone').value;
      state.clientEmail = $('#field-email').value;
      submitBooking();
      } else if (state.step === 4) {
        // Before going to step 5, we already pre-fill fields
        goNext();
      } else {
      goNext();
    }
  });

  $('#btn-prev').addEventListener('click', () => {
    if (state.step === 5) {
      state.clientName = $('#field-name').value;
      state.clientPhone = $('#field-phone').value;
      state.clientEmail = $('#field-email').value;
    }
    goPrev();
  });

  // When entering step 4, calculate time slots
  const observer = new MutationObserver(() => {
    const panel4 = document.querySelector('.booking-panel[data-step="4"]');
    if (panel4 && !panel4.classList.contains('hidden')) {
      buildTimeSlots();
    }
    // Pre-fill fields + show summary when entering step 5
    const panel5 = document.querySelector('.booking-panel[data-step="5"]');
    if (panel5 && !panel5.classList.contains('hidden')) {
      $('#field-name').value = state.clientName;
      $('#field-phone').value = state.clientPhone;
      $('#field-email').value = state.clientEmail;

      // Build booking summary
      const barber = state.barbers.find((b) => b.id === state.selectedBarber);
      const summary = $('#booking-summary');
      const dateObj = new Date(state.selectedDate + 'T12:00:00');
      const dateStr = dateObj.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const serviceList = state.selectedServices.map((s) => `<div class="flex justify-between"><span>${s.name}</span><span class="font-medium text-barber-accent">$${s.price}</span></div>`).join('');
      summary.innerHTML = `
        <div class="flex items-center gap-2 text-barber-dark"><i class="fa-solid fa-user text-barber-accent text-xs"></i><span class="font-medium">${barber ? barber.name : 'Barbero'}</span></div>
        <div class="flex items-center gap-2 text-barber-dark"><i class="fa-regular fa-calendar text-barber-accent text-xs"></i>${dateStr} — <strong>${state.selectedTime}</strong></div>
        <div class="border-t border-stone-200 pt-2 mt-2 ${state.selectedServices.length > 1 ? '' : 'hidden'}">
          ${serviceList}
        </div>
        <div class="flex justify-between border-t border-stone-200 pt-2 font-semibold text-barber-dark">
          <span>Total</span>
          <span class="text-barber-accent">$${totalPrice()} · ${totalDuration()} min</span>
        </div>
      `;
    }
  });

  // Watch for step changes
  $$('.booking-panel').forEach((el) => {
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
  });

  // ─── SCROLL REVEAL ────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  // Initial display
  showStep(1);
});
