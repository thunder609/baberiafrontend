import { $, api } from './utils.js';
import { t } from './translations.js';
import { state } from './state.js';

export async function loadBarbers() {
  try {
    state.barbers = await api('/api/barbers?onlyActive=true');
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
      return `
      <div class="barber-card reveal reveal-up delay-${delay} text-center">
        <div class="barber-avatar mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-stone-700">
          <div class="flex h-full items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900 text-4xl font-bold text-barber-accent">
            ${b.name.charAt(0)}
          </div>
        </div>
        <h3 class="mt-4 font-serif text-lg font-semibold text-white">${b.name}</h3>
        <p class="text-sm text-stone-400">${t('barbers.professional')}</p>
        <a href="#turnos" class="barber-cta mt-4 inline-block rounded-md border border-barber-accent/40 px-5 py-2 text-xs font-medium text-barber-accent transition hover:bg-barber-accent hover:text-white">
          <i class="fa-regular fa-calendar-check mr-1"></i>${t('barbers.bookWith', { name: b.name.split(' ')[0] })}
        </a>
      </div>
    `;
    })
    .join('');
}
