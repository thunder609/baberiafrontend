import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../core/services/appointment.service';
import { BarberService } from '../../core/services/barber.service';
import { ClientService } from '../../core/services/client.service';
import { ServiceService } from '../../core/services/service.service';
import type { AppointmentRequest } from '../../core/models';

@Component({
  selector: 'app-appointments',
  imports: [FormsModule],
  template: `
    <div class="mx-auto max-w-5xl">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold tracking-tight text-barber-dark">Turnos</h2>
        <div class="flex gap-2">
          <button
            (click)="loadAppointments()"
            class="rounded-md bg-barber-accent px-3 py-1.5 text-sm text-white transition hover:bg-amber-600"
          >
            Actualizar
          </button>
          <button
            (click)="openNew()"
            class="rounded-md border border-barber-accent px-3 py-1.5 text-sm text-barber-accent transition hover:bg-amber-50"
          >
            + Nuevo turno
          </button>
        </div>
      </div>

      <div class="mb-5 flex flex-wrap gap-3">
        <select
          [(ngModel)]="selectedBarberId"
          (change)="loadAppointments()"
          class="rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent"
        >
          <option [ngValue]="null">Todos los barberos</option>
          @for (b of barberService.items(); track b.id) {
            <option [ngValue]="b.id">{{ b.name }}</option>
          }
        </select>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium text-barber-muted">Desde</label>
          <input
            type="date"
            [(ngModel)]="selectedStartDate"
            (change)="loadAppointments()"
            class="rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium text-barber-muted">Hasta</label>
          <input
            type="date"
            [(ngModel)]="selectedEndDate"
            (change)="loadAppointments()"
            class="rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent"
          />
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-stone-200 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-barber-muted">
              <th class="px-4 py-3">Hora</th>
              @if (!selectedBarberId) {
                <th class="px-4 py-3">Barbero</th>
              }
              <th class="px-4 py-3">Cliente</th>
              <th class="px-4 py-3">Servicio</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            @for (apt of appointmentService.items(); track apt.id) {
              <tr class="border-b border-stone-100 transition hover:bg-stone-50">
                <td class="px-4 py-3 font-medium text-barber-dark">{{ timeDisplay(apt.startTime) }}</td>
                @if (!selectedBarberId) {
                  <td class="px-4 py-3 text-barber-muted">{{ barberName(apt.barberId) }}</td>
                }
                <td class="px-4 py-3 text-barber-muted">{{ clientName(apt.clientId) }}</td>
                <td class="px-4 py-3 text-barber-muted" [title]="apt.notes || ''">{{ serviceDisplay(apt) }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                    [class.bg-amber-50]="apt.status === 'PENDING'"
                    [class.text-amber-700]="apt.status === 'PENDING'"
                    [class.bg-blue-50]="apt.status === 'CONFIRMED'"
                    [class.text-blue-700]="apt.status === 'CONFIRMED'"
                    [class.bg-violet-50]="apt.status === 'IN_PROGRESS'"
                    [class.text-violet-700]="apt.status === 'IN_PROGRESS'"
                    [class.bg-emerald-50]="apt.status === 'COMPLETED'"
                    [class.text-emerald-700]="apt.status === 'COMPLETED'"
                    [class.bg-red-50]="apt.status === 'CANCELLED'"
                    [class.text-red-600]="apt.status === 'CANCELLED'"
                    [class.bg-stone-100]="apt.status === 'NO_SHOW'"
                    [class.text-stone-500]="apt.status === 'NO_SHOW'"
                  >
                    {{ statusLabel(apt.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  @if (apt.status === 'PENDING') {
                    <button (click)="transition(apt.id, 'confirm')" class="mr-1 text-xs font-medium text-blue-600 hover:text-blue-800">Confirmar</button>
                    <button (click)="transition(apt.id, 'cancel')" class="mr-1 text-xs font-medium text-red-500 hover:text-red-700">Cancelar</button>
                    <button (click)="transition(apt.id, 'no-show')" class="mr-1 text-xs font-medium text-stone-400 hover:text-stone-600">No-show</button>
                    <button (click)="openReassign(apt)" class="text-xs font-medium text-amber-600 hover:text-amber-800">Reasignar</button>
                  }
                  @if (apt.status === 'CONFIRMED') {
                    <button (click)="transition(apt.id, 'start')" class="mr-1 text-xs font-medium text-violet-600 hover:text-violet-800">Empezar</button>
                    <button (click)="transition(apt.id, 'cancel')" class="mr-1 text-xs font-medium text-red-500 hover:text-red-700">Cancelar</button>
                    <button (click)="transition(apt.id, 'no-show')" class="mr-1 text-xs font-medium text-stone-400 hover:text-stone-600">No-show</button>
                    <button (click)="openReassign(apt)" class="text-xs font-medium text-amber-600 hover:text-amber-800">Reasignar</button>
                  }
                  @if (apt.status === 'IN_PROGRESS') {
                    <button (click)="transition(apt.id, 'complete')" class="mr-1 text-xs font-medium text-emerald-600 hover:text-emerald-800">Completar</button>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td [colSpan]="selectedBarberId ? 5 : 6" class="px-4 py-12 text-center text-sm text-barber-muted">
                  @if (selectedBarberId || selectedStartDate || selectedEndDate) {
                    No hay turnos para este filtro.
                  } @else {
                    Seleccioná un barbero y rango de fechas para ver los turnos.
                  }
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
          <h3 class="mb-5 text-base font-bold text-barber-dark">Nuevo turno</h3>

          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Barbero</label>
            <select [(ngModel)]="form.barberId" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent">
              <option [ngValue]="null">Seleccionar</option>
              @for (b of barberService.items(); track b.id) {
                <option [ngValue]="b.id">{{ b.name }}</option>
              }
            </select>
          </div>
          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Cliente</label>
            <select [(ngModel)]="form.clientId" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent">
              <option [ngValue]="null">Seleccionar</option>
              @for (c of clientService.items(); track c.id) {
                <option [ngValue]="c.id">{{ c.name }}</option>
              }
            </select>
          </div>
          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Servicio</label>
            <select [(ngModel)]="form.serviceId" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent">
              <option [ngValue]="null">Seleccionar</option>
              @for (s of serviceService.items(); track s.id) {
                <option [ngValue]="s.id">{{ s.name }} (\${{ s.price }})</option>
              }
            </select>
          </div>
          <div class="mb-3 flex gap-3">
            <div class="flex-1">
              <label class="mb-1 block text-xs font-medium text-barber-muted">Fecha</label>
              <input [(ngModel)]="formDate" type="date" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
            </div>
            <div class="flex-1">
              <label class="mb-1 block text-xs font-medium text-barber-muted">Hora</label>
              <input [(ngModel)]="formTime" type="time" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
            </div>
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Notas</label>
            <input [(ngModel)]="form.notes" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark placeholder-stone-400 transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
          </div>

          @if (errors().length) {
            <div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              @for (err of errors(); track err) {
                <p>{{ err }}</p>
              }
            </div>
          }

          <div class="flex justify-end gap-2">
            <button (click)="closeForm()" class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-barber-muted transition hover:bg-stone-50">Cancelar</button>
            <button (click)="save()" [disabled]="saving()" class="rounded-lg bg-barber-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-50">
              {{ saving() ? 'Guardando…' : 'Crear turno' }}
            </button>
          </div>
        </div>
      </div>
    }

    @if (showReassign()) {
      <div
        class="fixed inset-0 z-10 flex items-center justify-center bg-black/40"
        (click)="closeReassign()"
      >
        <div class="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-6 shadow-2xl" (click)="$event.stopPropagation()">
          <h3 class="mb-5 text-base font-bold text-barber-dark">Reasignar turno</h3>

          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Cliente</label>
            <select [(ngModel)]="reassignClientId" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent">
              <option [ngValue]="null">Seleccionar</option>
              @for (c of clientService.items(); track c.id) {
                <option [ngValue]="c.id">{{ c.name }}</option>
              }
            </select>
          </div>
          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Servicio</label>
            <select [(ngModel)]="reassignServiceId" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent">
              @for (s of serviceService.items(); track s.id) {
                <option [ngValue]="s.id">{{ s.name }} (\${{ s.price }})</option>
              }
            </select>
          </div>
          <div class="mb-3 flex gap-3">
            <div class="flex-1">
              <label class="mb-1 block text-xs font-medium text-barber-muted">Fecha</label>
              <input [(ngModel)]="reassignDate" type="date" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
            </div>
            <div class="flex-1">
              <label class="mb-1 block text-xs font-medium text-barber-muted">Hora</label>
              <input [(ngModel)]="reassignTime" type="time" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
            </div>
          </div>

          @if (errors().length) {
            <div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              @for (err of errors(); track err) {
                <p>{{ err }}</p>
              }
            </div>
          }

          <div class="flex justify-end gap-2">
            <button (click)="closeReassign()" class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-barber-muted transition hover:bg-stone-50">Cancelar</button>
            <button (click)="saveReassign()" [disabled]="reassignSaving()" class="rounded-lg bg-barber-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-50">
              {{ reassignSaving() ? 'Guardando…' : 'Reasignar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class Appointments implements OnInit {
  protected readonly showForm = signal(false);
  protected readonly showReassign = signal(false);
  protected readonly errors = signal<string[]>([]);
  protected readonly reassignSaving = signal(false);
  protected selectedBarberId: number | null = null;
  protected todayLocal = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  protected selectedStartDate = this.todayLocal;
  protected selectedEndDate = this.todayLocal;
  protected formDate = this.todayLocal;
  protected formTime = '09:00';

  protected readonly form: AppointmentRequest = {
    barberId: null as unknown as number,
    clientId: null as unknown as number,
    serviceId: null as unknown as number,
    startTime: '',
    notes: '',
  };

  // --- Reassign state ---
  protected reassignAptId: number | null = null;
  protected reassignClientId: number | null = null;
  protected reassignDate = '';
  protected reassignTime = '';
  protected reassignServiceId: number | null = null;

  constructor(
    protected appointmentService: AppointmentService,
    protected barberService: BarberService,
    protected clientService: ClientService,
    protected serviceService: ServiceService,
  ) {}

  ngOnInit() {
    this.barberService.loadAll(true);
    this.clientService.loadAll();
    this.serviceService.loadAll(true);
  }

  protected loadAppointments() {
    this.clientService.loadAll();
    this.appointmentService.loadByFilter(
      this.selectedBarberId,
      this.selectedStartDate,
      this.selectedEndDate,
    );
  }

  protected barberName(id: number): string {
    return this.barberService.items().find((b) => b.id === id)?.name ?? `#${id}`;
  }

  protected clientName(id: number): string {
    return this.clientService.items().find((c) => c.id === id)?.name ?? `#${id}`;
  }

  protected serviceName(id: number): string {
    return this.serviceService.items().find((s) => s.id === id)?.name ?? `#${id}`;
  }

  protected serviceDisplay(apt: { serviceId: number; notes?: string }): string {
    if (apt.notes?.startsWith('Reserva desde landing: ')) {
      return apt.notes.replace('Reserva desde landing: ', '');
    }
    return this.serviceName(apt.serviceId);
  }

  protected timeDisplay(startTime: string): string {
    return startTime.slice(11, 16);
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      IN_PROGRESS: 'En curso',
      COMPLETED: 'Completado',
      CANCELLED: 'Cancelado',
      NO_SHOW: 'No asistió',
    };
    return labels[status] ?? status;
  }

  protected openNew() {
    this.form.barberId = null as unknown as number;
    this.form.clientId = null as unknown as number;
    this.form.serviceId = null as unknown as number;
    this.form.notes = '';
    this.formDate = this.selectedStartDate;
    this.formTime = '09:00';
    this.errors.set([]);
    this.showForm.set(true);
  }

  protected closeForm() {
    this.errors.set([]);
    this.showForm.set(false);
  }

  protected validate(): boolean {
    const msgs: string[] = [];

    if (!this.form.barberId) msgs.push('Seleccioná un barbero.');
    if (!this.form.clientId) msgs.push('Seleccioná un cliente.');
    if (!this.form.serviceId) msgs.push('Seleccioná un servicio.');
    if (!this.formDate) msgs.push('Seleccioná una fecha.');
    if (!this.formTime) msgs.push('Seleccioná un horario.');

    if (this.formDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selected = new Date(this.formDate + 'T12:00:00');
      selected.setHours(0, 0, 0, 0);

      if (selected < today) {
        msgs.push('La fecha no puede ser anterior a hoy.');
      } else if (selected.getTime() === today.getTime() && this.formTime) {
        const now = new Date();
        const [h, m] = this.formTime.split(':').map(Number);
        if (h * 60 + m <= now.getHours() * 60 + now.getMinutes()) {
          msgs.push('La hora no puede ser anterior o igual a la hora actual.');
        }
      }
    }

    this.errors.set(msgs);
    return msgs.length === 0;
  }

  protected saving = signal(false);

  protected save() {
    if (!this.validate()) return;
    if (this.saving()) return;

    this.form.startTime = `${this.formDate}T${this.formTime}:00`;
    this.saving.set(true);
    this.appointmentService.create({ ...this.form }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.loadAppointments();
      },
      error: (err) => {
        this.saving.set(false);
        if (err.error?.message) {
          this.errors.set([err.error.message]);
        } else if (err.status === 409) {
          this.errors.set(['El turno coincide con otro existente. Revisá el horario.']);
        } else if (typeof err.error === 'string') {
          this.errors.set([err.error]);
        } else {
          this.errors.set(['Error al crear el turno. Verificá los datos e intentá de nuevo.']);
        }
      },
    });
  }

  protected openReassign(apt: { id: number; clientId: number; serviceId: number; startTime: string }) {
    this.reassignAptId = apt.id;
    this.reassignClientId = apt.clientId;
    this.reassignServiceId = apt.serviceId;
    this.reassignDate = apt.startTime.slice(0, 10);
    this.reassignTime = apt.startTime.slice(11, 16);
    this.errors.set([]);
    this.showReassign.set(true);
  }

  protected closeReassign() {
    this.errors.set([]);
    this.showReassign.set(false);
    this.reassignAptId = null;
  }

  protected saveReassign() {
    if (!this.reassignAptId) return;
    if (!this.reassignClientId) {
      this.errors.set(['Seleccioná un cliente.']);
      return;
    }
    if (!this.reassignDate || !this.reassignTime) {
      this.errors.set(['Seleccioná fecha y hora.']);
      return;
    }

    this.reassignSaving.set(true);
    const startTime = `${this.reassignDate}T${this.reassignTime}:00`;
    this.appointmentService.reassign(
      this.reassignAptId,
      this.reassignClientId,
      startTime,
      this.reassignServiceId ?? undefined,
    ).subscribe({
      next: () => {
        this.reassignSaving.set(false);
        this.closeReassign();
        this.loadAppointments();
      },
      error: (err) => {
        this.reassignSaving.set(false);
        if (err.error?.message) {
          this.errors.set([err.error.message]);
        } else if (err.status === 409) {
          this.errors.set(['El horario elegido coincide con otro turno.']);
        } else {
          this.errors.set(['Error al reasignar el turno.']);
        }
      },
    });
  }

  protected transition(id: number, action: string) {
    const transitions: Record<string, () => any> = {
      confirm: () => this.appointmentService.confirm(id),
      start: () => this.appointmentService.start(id),
      complete: () => this.appointmentService.complete(id),
      cancel: () => this.appointmentService.cancel(id),
      'no-show': () => this.appointmentService.markNoShow(id),
    };
    transitions[action]?.().subscribe({
      next: () => this.loadAppointments(),
      error: () => {
        // fallo silencioso — el backend rechazó la transición
      },
    });
  }
}
