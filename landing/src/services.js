import { $, api } from './utils.js';
import { t } from './translations.js';
import { state } from './state.js';

const BRO_BASE = 'https://themes.getmotopress.com/bro-barbershop/wp-content/uploads/sites/64/2024/01';
const SERVICE_IMAGES = {
  'corte': `${BRO_BASE}/service-1-color.jpg`,
  'barba': `${BRO_BASE}/service-2.jpg`,
  'afeitado': `${BRO_BASE}/service-3-color.jpg`,
  'cejas': `${BRO_BASE}/gallery-7.jpg`,
  'tinte': `${BRO_BASE}/service-4-color.jpg`,
  'perfilado': `${BRO_BASE}/gallery-6.jpg`,
};

function getServiceImage(name) {
  const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (key.includes('corte') && key.includes('barba')) {
    return `${BRO_BASE}/gallery-2.jpg`;
  }
  for (const [kw, url] of Object.entries(SERVICE_IMAGES)) {
    if (key.includes(kw)) return url;
  }
  return SERVICE_IMAGES['corte'];
}

export async function loadServices() {
  try {
    state.services = await api('/api/services?onlyActive=true');
  } catch (e) {
    $('#services-grid').innerHTML = `<p class="col-span-full text-center text-sm text-barber-muted">${t('services.error')}</p>`;
    return;
  }
  renderServicesGrid();
}

export function renderServicesGrid() {
  const grid = $('#services-grid');
  if (state.services.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-sm text-barber-muted">${t('services.empty')}</p>`;
    return;
  }
  grid.innerHTML = state.services
    .map((s, i) => {
      const img = getServiceImage(s.name);
      const delay = Math.min(100 + i * 100, 600);
      return `
      <div class="service-card reveal reveal-up delay-${delay} rounded-lg border border-stone-200 bg-white cursor-default overflow-hidden">
        <div class="aspect-[4/3] overflow-hidden bg-stone-100">
          <img
            src="${img}"
            alt="${s.name}"
            class="h-full w-full object-cover transition duration-400"
            loading="lazy"
          />
        </div>
        <div class="p-5 text-center">
          <h3 class="font-serif text-lg font-semibold text-barber-dark">${s.name}</h3>
          <p class="mt-1 text-sm text-barber-muted">${s.description || ''}</p>
          <div class="mt-4 flex items-center justify-center gap-2">
            <span class="text-2xl font-bold text-barber-accent">$${s.price}</span>
            <span class="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-barber-muted">${s.durationMinutes} min</span>
          </div>
        </div>
      </div>
    `;
    })
    .join('');
}
