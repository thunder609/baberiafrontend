import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScheduleService } from '../../core/services/schedule.service';
import type { ScheduleRequest } from '../../core/models';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

@Component({
  selector: 'app-schedules',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-6 flex items-start justify-between">
        <div>
          <a routerLink="/barbers" class="text-xs font-medium text-barber-accent hover:text-amber-700">&larr; Barberos</a>
          <h2 class="text-xl font-bold tracking-tight text-barber-dark">Horarios</h2>
        </div>
        <button
          (click)="openNew()"
          class="rounded-md bg-barber-accent px-4 py-1.5 text-sm text-white transition hover:bg-amber-600"
        >
          + Nuevo horario
        </button>
      </div>

      <div class="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-stone-200 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-barber-muted">
              <th class="px-4 py-3">Día</th>
              <th class="px-4 py-3">Inicio</th>
              <th class="px-4 py-3">Fin</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            @for (s of scheduleService.items(); track s.id) {
              <tr class="border-b border-stone-100 transition hover:bg-stone-50">
                <td class="px-4 py-3 font-medium text-barber-dark">{{ DAY_NAMES[s.dayOfWeek] }}</td>
                <td class="px-4 py-3 text-barber-muted">{{ s.startTime }}</td>
                <td class="px-4 py-3 text-barber-muted">{{ s.endTime }}</td>
                <td class="px-4 py-3 text-right">
                  <button (click)="openEdit(s)" class="mr-2 text-xs font-medium text-barber-accent hover:text-amber-700">Editar</button>
                  <button (click)="confirmDelete(s.id)" class="text-xs font-medium text-red-500 hover:text-red-700">Eliminar</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-4 py-12 text-center text-sm text-barber-muted">
                  No hay horarios configurados para este barbero.
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
          <h3 class="mb-5 text-base font-bold text-barber-dark">{{ editingId() ? 'Editar horario' : 'Nuevo horario' }}</h3>

          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Día</label>
            <select [(ngModel)]="form.dayOfWeek" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent">
              @for (name of DAY_NAMES; track $index) {
                <option [ngValue]="$index">{{ name }}</option>
              }
            </select>
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

          <div class="flex justify-end gap-2">
            <button (click)="closeForm()" class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-barber-muted transition hover:bg-stone-50">Cancelar</button>
            <button (click)="save()" class="rounded-lg bg-barber-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600">
              {{ editingId() ? 'Guardar' : 'Crear' }}
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
          <p class="mb-4 text-sm text-barber-dark">¿Eliminar este horario?</p>
          <div class="flex justify-end gap-2">
            <button (click)="cancelDelete()" class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-barber-muted transition hover:bg-stone-50">Cancelar</button>
            <button (click)="doDelete()" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">Eliminar</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class Schedules implements OnInit {
  protected readonly DAY_NAMES = DAY_NAMES;
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly deletingId = signal<number | null>(null);

  protected readonly form: ScheduleRequest = {
    dayOfWeek: 0,
    startTime: '',
    endTime: '',
  };

  private barberId = 0;

  constructor(
    protected scheduleService: ScheduleService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.barberId = Number(this.route.snapshot.paramMap.get('id'));
    this.scheduleService.loadByBarber(this.barberId);
  }

  protected openNew() {
    this.editingId.set(null);
    this.form.dayOfWeek = 1;
    this.form.startTime = '09:00';
    this.form.endTime = '18:00';
    this.showForm.set(true);
  }

  protected openEdit(s: { id: number; dayOfWeek: number; startTime: string; endTime: string }) {
    this.editingId.set(s.id);
    this.form.dayOfWeek = s.dayOfWeek;
    this.form.startTime = s.startTime;
    this.form.endTime = s.endTime;
    this.showForm.set(true);
  }

  protected closeForm() {
    this.showForm.set(false);
  }

  protected save() {
    const req = { ...this.form };
    const id = this.editingId();
    const obs = id
      ? this.scheduleService.update(id, req)
      : this.scheduleService.create(this.barberId, req);
    obs.subscribe(() => {
      this.closeForm();
      this.scheduleService.loadByBarber(this.barberId);
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
      this.scheduleService.delete(id).subscribe(() => {
        this.deletingId.set(null);
        this.scheduleService.loadByBarber(this.barberId);
      });
    }
  }
}
