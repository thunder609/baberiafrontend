import { $, api } from './utils.js';
import { t } from './translations.js';
import { state } from './state.js';

const BASE_IMG = 'https://barbe.vercel.app/imagenespro';
const SERVICE_IMAGES = {
  'corte': `${BASE_IMG}/cabello.jpg`,
  'barba': `${BASE_IMG}/barba.jpg`,
  'afeitado': `${BASE_IMG}/barba.jpg`,
  'cejas': `${BASE_IMG}/cabello.jpg`,
  'tinte': `${BASE_IMG}/cabello.jpg`,
  'perfilado': `${BASE_IMG}/barba.jpg`,
};

function getServiceImage(name) {
  const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (key.includes('corte') && key.includes('barba')) {
    return `${BASE_IMG}/cabello+barba.jpg`;
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
