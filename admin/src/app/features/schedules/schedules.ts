import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScheduleService } from '../../core/services/schedule.service';
import type { ScheduleRequest } from '../../core/models';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface DayEntry {
  id: number | null;
  dayOfWeek: number;
  working: boolean;
  startTime: string;
  endTime: string;
}

function emptyWeek(): DayEntry[] {
  return DAY_NAMES.map((_, i) => ({
    id: null,
    dayOfWeek: i,
    working: false,
    startTime: '09:00',
    endTime: '18:00',
  }));
}

@Component({
  selector: 'app-schedules',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-3xl">
      <div class="mb-6 flex items-start justify-between">
        <div>
          <a routerLink="/barbers" class="text-xs font-medium text-barber-accent hover:text-amber-700">&larr; Barberos</a>
          <h2 class="text-xl font-bold tracking-tight text-barber-dark">Horarios</h2>
        </div>
        <button
          (click)="openWeekModal()"
          class="rounded-md bg-barber-accent px-4 py-1.5 text-sm text-white transition hover:bg-amber-600"
        >
          <i class="fa-regular fa-calendar-circle-plus mr-1"></i>Configurar semana
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
                  <button (click)="deleteOne(s.id)" class="text-xs font-medium text-red-500 hover:text-red-700">Eliminar</button>
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

      @if (showWeekModal()) {
        <div
          class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 py-10"
          (click)="closeWeekModal()"
        >
          <div
            class="w-full max-w-lg rounded-xl border border-stone-200 bg-white p-6 shadow-2xl"
            (click)="$event.stopPropagation()"
          >
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-base font-bold text-barber-dark">Configurar horario semanal</h3>
              <button
                (click)="fillFromFirst()"
                class="rounded-md bg-stone-100 px-3 py-1 text-xs font-medium text-barber-muted transition hover:bg-stone-200"
                title="Copiar horario del primer día a todos los demás"
              >
                <i class="fa-regular fa-copy mr-1"></i>Copiar a todos
              </button>
            </div>

            <div class="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
              @for (day of weekDays(); track day.dayOfWeek) {
                <div
                  class="flex items-center gap-3 rounded-lg border p-3 transition"
                  [class.border-barber-accent/30]="day.working"
                  [class.border-stone-200]="!day.working"
                  [class.bg-amber-50/40]="day.working"
                >
                  <label class="flex w-28 cursor-pointer items-center gap-2 text-sm font-medium text-barber-dark">
                    <input
                      type="checkbox"
                      [(ngModel)]="day.working"
                      class="h-4 w-4 rounded border-stone-300 text-barber-accent focus:ring-barber-accent"
                    />
                    {{ DAY_NAMES[day.dayOfWeek] }}
                  </label>

                  @if (day.working) {
                    <div class="flex flex-1 items-center gap-2">
                      <input
                        [(ngModel)]="day.startTime"
                        type="time"
                        class="w-28 rounded-lg border border-stone-200 px-2 py-1.5 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent"
                      />
                      <span class="text-xs text-barber-muted">a</span>
                      <input
                        [(ngModel)]="day.endTime"
                        type="time"
                        class="w-28 rounded-lg border border-stone-200 px-2 py-1.5 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent"
                      />
                      <button
                        (click)="copyDown(day.dayOfWeek)"
                        class="ml-auto rounded p-1 text-xs text-barber-muted transition hover:bg-stone-100 hover:text-barber-accent"
                        title="Copiar a los siguientes días"
                      >
                        <i class="fa-regular fa-arrow-down"></i>
                      </button>
                    </div>
                  } @else {
                    <span class="flex-1 text-center text-xs italic text-barber-muted">Descanso</span>
                  }
                </div>
              }
            </div>

            <div class="mt-6 flex justify-end gap-2 border-t border-stone-100 pt-4">
              <button
                (click)="closeWeekModal()"
                class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-barber-muted transition hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button
                (click)="saveWeek()"
                [disabled]="saving()"
                class="rounded-lg bg-barber-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                @if (saving()) {
                  <span><i class="fa-solid fa-spinner fa-spin mr-1"></i>Guardando...</span>
                } @else {
                  <span>Guardar todo</span>
                }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class Schedules implements OnInit {
  protected readonly DAY_NAMES = DAY_NAMES;
  protected readonly showWeekModal = signal(false);
  protected readonly weekDays = signal<DayEntry[]>([]);
  protected readonly saving = signal(false);

  private barberId = 0;

  constructor(
    protected scheduleService: ScheduleService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.barberId = Number(this.route.snapshot.paramMap.get('id'));
    this.scheduleService.loadByBarber(this.barberId);
  }

  protected openWeekModal() {
    const existing = this.scheduleService.items();
    const week = emptyWeek();

    for (const s of existing) {
      week[s.dayOfWeek].id = s.id;
      week[s.dayOfWeek].working = true;
      week[s.dayOfWeek].startTime = s.startTime;
      week[s.dayOfWeek].endTime = s.endTime;
    }

    this.weekDays.set(week);
    this.showWeekModal.set(true);
  }

  protected closeWeekModal() {
    this.showWeekModal.set(false);
  }

  protected fillFromFirst() {
    const days = this.weekDays();
    const first = days.find((d) => d.working);
    if (!first) return;
    for (const day of days) {
      if (day.working) {
        day.startTime = first.startTime;
        day.endTime = first.endTime;
      }
    }
  }

  protected copyDown(fromDay: number) {
    const days = this.weekDays();
    const source = days[fromDay];
    for (let i = fromDay + 1; i < days.length; i++) {
      if (days[i].working) {
        days[i].startTime = source.startTime;
        days[i].endTime = source.endTime;
      }
    }
  }

  protected async saveWeek() {
    this.saving.set(true);

    const days = this.weekDays();
    const existing = this.scheduleService.items();
    const existingByDay = new Map(existing.map((s) => [s.dayOfWeek, s]));

    const ops: Promise<void>[] = [];

    for (const day of days) {
      const prev = existingByDay.get(day.dayOfWeek);

      if (day.working && day.startTime && day.endTime) {
        const req: ScheduleRequest = {
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
        };

        if (prev) {
          if (prev.startTime !== day.startTime || prev.endTime !== day.endTime) {
            ops.push(
              new Promise((resolve) => {
                this.scheduleService.update(prev.id, req).subscribe({
                  next: () => resolve(),
                  error: () => resolve(),
                });
              }),
            );
          }
        } else {
          ops.push(
            new Promise((resolve) => {
              this.scheduleService.create(this.barberId, req).subscribe({
                next: () => resolve(),
                error: () => resolve(),
              });
            }),
          );
        }
      } else if (!day.working && prev) {
        ops.push(
          new Promise((resolve) => {
            this.scheduleService.delete(prev.id).subscribe({
              next: () => resolve(),
              error: () => resolve(),
            });
          }),
        );
      }
    }

    await Promise.all(ops);
    this.scheduleService.loadByBarber(this.barberId);
    this.saving.set(false);
    this.closeWeekModal();
  }

  protected deleteOne(id: number) {
    if (!confirm('¿Eliminar este horario?')) return;
    this.scheduleService.delete(id).subscribe(() => {
      this.scheduleService.loadByBarber(this.barberId);
    });
  }
}
