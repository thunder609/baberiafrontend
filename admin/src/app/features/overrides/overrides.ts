import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OverrideService } from '../../core/services/override.service';
import type { OverrideRequest } from '../../core/models';

@Component({
  selector: 'app-overrides',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-6 flex items-start justify-between">
        <div>
          <a routerLink="/barbers" class="text-xs font-medium text-barber-accent hover:text-amber-700">&larr; Barberos</a>
          <h2 class="text-xl font-bold tracking-tight text-barber-dark">Excepciones</h2>
        </div>
        <button
          (click)="openNew()"
          class="rounded-md bg-barber-accent px-4 py-1.5 text-sm text-white transition hover:bg-amber-600"
        >
          + Nueva excepción
        </button>
      </div>

      <div class="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-stone-200 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-barber-muted">
              <th class="px-4 py-3">Fecha</th>
              <th class="px-4 py-3">Inicio</th>
              <th class="px-4 py-3">Fin</th>
              <th class="px-4 py-3">Disponible</th>
              <th class="px-4 py-3">Motivo</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            @for (o of overrideService.items(); track o.id) {
              <tr class="border-b border-stone-100 transition hover:bg-stone-50">
                <td class="px-4 py-3 font-medium text-barber-dark">{{ o.date }}</td>
                <td class="px-4 py-3 text-barber-muted">{{ o.startTime }}</td>
                <td class="px-4 py-3 text-barber-muted">{{ o.endTime }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                    [class.bg-emerald-50]="o.available"
                    [class.text-emerald-700]="o.available"
                    [class.bg-red-50]="!o.available"
                    [class.text-red-600]="!o.available"
                  >
                    {{ o.available ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-barber-muted">{{ o.reason ?? '—' }}</td>
                <td class="px-4 py-3 text-right">
                  <button (click)="confirmDelete(o.id)" class="text-xs font-medium text-red-500 hover:text-red-700">Eliminar</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-4 py-12 text-center text-sm text-barber-muted">
                  No hay excepciones para este barbero.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (showForm()) {
      <div
        class="fixed inset-0 z-10 flex items-center justify-center bg-black/40"
        (click)="closeForm()"
      >
        <div class="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-6 shadow-2xl" (click)="$event.stopPropagation()">
          <h3 class="mb-5 text-base font-bold text-barber-dark">Nueva excepción</h3>

          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Fecha</label>
            <input [(ngModel)]="form.date" type="date" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
          </div>
          <div class="mb-3 flex gap-3">
            <div class="flex-1">
              <label class="mb-1 block text-xs font-medium text-barber-muted">Inicio</label>
              <input [(ngModel)]="form.startTime" type="time" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
            </div>
            <div class="flex-1">
              <label class="mb-1 block text-xs font-medium text-barber-muted">Fin</label>
              <input [(ngModel)]="form.endTime" type="time" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
            </div>
          </div>
          <div class="mb-3">
            <label class="mb-1 flex items-center gap-2 text-sm text-barber-dark">
              <input [(ngModel)]="form.available" type="checkbox" class="rounded border-stone-300 text-barber-accent transition focus:ring-barber-accent" />
              Disponible para turnos
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Motivo</label>
            <input [(ngModel)]="form.reason" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark placeholder-stone-400 transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
          </div>

          <div class="flex justify-end gap-2">
            <button (click)="closeForm()" class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-barber-muted transition hover:bg-stone-50">Cancelar</button>
            <button (click)="save()" class="rounded-lg bg-barber-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600">
              Crear
            </button>
          </div>
        </div>
      </div>
    }

    @if (deletingId()) {
      <div
        class="fixed inset-0 z-10 flex items-center justify-center bg-black/40"
        (click)="cancelDelete()"
      >
        <div class="rounded-xl border border-stone-200 bg-white p-6 shadow-2xl" (click)="$event.stopPropagation()">
          <p class="mb-4 text-sm text-barber-dark">¿Eliminar esta excepción?</p>
          <div class="flex justify-end gap-2">
            <button (click)="cancelDelete()" class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-barber-muted transition hover:bg-stone-50">Cancelar</button>
            <button (click)="doDelete()" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">Eliminar</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class Overrides implements OnInit {
  protected readonly showForm = signal(false);
  protected readonly deletingId = signal<number | null>(null);

  protected readonly form: OverrideRequest = {
    date: '',
    startTime: '',
    endTime: '',
    available: true,
    reason: '',
  };

  private barberId = 0;

  constructor(
    protected overrideService: OverrideService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.barberId = Number(this.route.snapshot.paramMap.get('id'));
    this.overrideService.loadByBarber(this.barberId);
  }

  protected openNew() {
    const d = new Date();
    this.form.date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.form.startTime = '09:00';
    this.form.endTime = '18:00';
    this.form.available = true;
    this.form.reason = '';
    this.showForm.set(true);
  }

  protected closeForm() {
    this.showForm.set(false);
  }

  protected save() {
    this.overrideService.create(this.barberId, { ...this.form }).subscribe(() => {
      this.closeForm();
      this.overrideService.loadByBarber(this.barberId);
    });
  }

  protected confirmDelete(id: number) {
    this.deletingId.set(id);
  }

  protected cancelDelete() {
    this.deletingId.set(null);
  }

  protected doDelete() {
    const id = this.deletingId();
    if (id) {
      this.overrideService.delete(id).subscribe(() => {
        this.deletingId.set(null);
        this.overrideService.loadByBarber(this.barberId);
      });
    }
  }
}
