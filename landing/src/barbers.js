import { $, api } from './utils.js';
import { t } from './translations.js';
import { state } from './state.js';

const BRO_BASE = 'https://themes.getmotopress.com/bro-barbershop/wp-content/uploads/sites/64/2024/01';

export async function loadBarbers() {
  try {
    state.barbers = await api('/api/barbers?onlyActive=true', { ttl: 1_800_000 });
  } catch (e) {
    $('#barbers-grid').innerHTML = `<p class="col-span-full text-center text-sm text-stone-400">${t('barbers.error')}</p>`;
    return;
  }
  renderBarbersGrid();
}

export function renderBarbersGrid() {
  const grid = $('#barbers-grid');
  if (state.barbers.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-sm text-stone-400">${t('barbers.empty')}</p>`;
    return;
  }
  grid.innerHTML = state.barbers
    .map((b, i) => {
      const delay = Math.min(100 + i * 100, 600);
      const img = b.photoUrl || `${BRO_BASE}/barber-${(i % 4) + 1}.jpg`;
      return `
      <div class="barber-card reveal reveal-up delay-${delay} group rounded-lg border border-stone-700/50 bg-stone-800/30 p-5 text-center transition hover:bg-stone-800/60">
        <div class="mx-auto h-28 w-28 overflow-hidden rounded-full">
          <img
            src="${img}"
            alt="${b.name}"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <h3 class="mt-4 font-serif text-base font-semibold text-white">${b.name}</h3>
        <p class="text-xs text-stone-400">${t('barbers.professional')}</p>
        <a href="#turnos" class="barber-cta mt-4 inline-flex items-center gap-1.5 rounded-md border border-barber-accent/30 px-4 py-1.5 text-xs font-medium text-barber-accent transition hover:bg-barber-accent hover:text-white">
          <i class="fa-regular fa-calendar-check"></i>${t('barbers.bookWith', { name: b.name.split(' ')[0] })}
        </a>
      </div>
    `;
    })
    .join('');
}
