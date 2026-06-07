import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../core/services/service.service';
import type { BarberService, ServiceRequest } from '../../core/models';

@Component({
  selector: 'app-services',
  imports: [FormsModule],
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold tracking-tight text-barber-dark">Servicios</h2>
        <button
          (click)="openNew()"
          class="rounded-md bg-barber-accent px-4 py-1.5 text-sm text-white transition hover:bg-amber-600"
        >
          + Nuevo
        </button>
      </div>

      <div class="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-stone-200 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-barber-muted">
              <th class="px-4 py-3">Nombre</th>
              <th class="px-4 py-3">Duración</th>
              <th class="px-4 py-3">Precio</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            @for (svc of service.items(); track svc.id) {
              <tr class="border-b border-stone-100 transition hover:bg-stone-50">
                <td class="px-4 py-3 font-medium text-barber-dark">{{ svc.name }}</td>
                <td class="px-4 py-3 text-barber-muted">{{ svc.durationMinutes }} min</td>
                <td class="px-4 py-3 font-medium text-barber-dark">\${{ svc.price }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                    [class.bg-emerald-50]="svc.active"
                    [class.text-emerald-700]="svc.active"
                    [class.bg-stone-100]="!svc.active"
                    [class.text-stone-500]="!svc.active"
                  >
                    {{ svc.active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  @if (svc.active) {
                    <button (click)="toggleActive(svc)" class="mr-2 text-xs font-medium text-amber-600 hover:text-amber-800">
                      Desactivar
                    </button>
                  } @else {
                    <button (click)="toggleActive(svc)" class="mr-2 text-xs font-medium text-emerald-600 hover:text-emerald-800">
                      Activar
                    </button>
                  }
                  <button (click)="openEdit(svc)" class="mr-2 text-xs font-medium text-barber-accent hover:text-amber-700">
                    Editar
                  </button>
                  <button (click)="confirmDelete(svc.id)" class="text-xs font-medium text-red-500 hover:text-red-700">
                    Eliminar
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="px-4 py-12 text-center text-sm text-barber-muted">
                  No hay servicios cargados.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (deletingId()) {
      <div
        class="fixed inset-0 z-10 flex items-center justify-center bg-black/40"
        (click)="cancelDelete()"
      >
        <div class="rounded-xl border border-stone-200 bg-white p-6 shadow-2xl" (click)="$event.stopPropagation()">
          <p class="mb-4 text-sm text-barber-dark">¿Eliminar este servicio?</p>
          <div class="flex justify-end gap-2">
            <button (click)="cancelDelete()" class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-barber-muted transition hover:bg-stone-50">Cancelar</button>
            <button (click)="doDelete()" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">Eliminar</button>
          </div>
        </div>
      </div>
    }

    @if (showForm()) {
      <div
        class="fixed inset-0 z-10 flex items-center justify-center bg-black/40"
        (click)="closeForm()"
      >
        <div class="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-6 shadow-2xl" (click)="$event.stopPropagation()">
          <h3 class="mb-5 text-base font-bold text-barber-dark">
            {{ editingId() ? 'Editar servicio' : 'Nuevo servicio' }}
          </h3>
          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Nombre</label>
            <input [(ngModel)]="form.name" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark placeholder-stone-400 transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
          </div>
          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Descripción</label>
            <input [(ngModel)]="form.description" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark placeholder-stone-400 transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
          </div>
          <div class="mb-3 flex gap-3">
            <div class="flex-1">
              <label class="mb-1 block text-xs font-medium text-barber-muted">Duración (min)</label>
              <input [(ngModel)]="form.durationMinutes" type="number" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
            </div>
            <div class="flex-1">
              <label class="mb-1 block text-xs font-medium text-barber-muted">Precio (\$)</label>
              <input [(ngModel)]="form.price" type="number" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button (click)="closeForm()" class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-barber-muted transition hover:bg-stone-50">Cancelar</button>
            <button (click)="save()" class="rounded-lg bg-barber-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600">
              Guardar
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class Services implements OnInit {
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly deletingId = signal<number | null>(null);
  protected readonly form: ServiceRequest = {
    name: '', description: '', durationMinutes: 30, price: 0,
  };

  constructor(protected service: ServiceService) {}

  ngOnInit() {
    this.service.loadAll();
  }

  protected openNew() {
    this.form.name = '';
    this.form.description = '';
    this.form.durationMinutes = 30;
    this.form.price = 0;
    this.editingId.set(null);
    this.showForm.set(true);
  }

  protected openEdit(svc: BarberService) {
    this.form.name = svc.name;
    this.form.description = svc.description;
    this.form.durationMinutes = svc.durationMinutes;
    this.form.price = svc.price;
    this.editingId.set(svc.id);
    this.showForm.set(true);
  }

  protected closeForm() {
    this.showForm.set(false);
  }

  protected save() {
    const obs = this.editingId()
      ? this.service.update(this.editingId()!, { ...this.form })
      : this.service.create({ ...this.form });

    obs.subscribe(() => {
      this.closeForm();
      this.service.loadAll();
    });
  }

  protected toggleActive(svc: BarberService) {
    const obs = svc.active
      ? this.service.deactivate(svc.id)
      : this.service.activate(svc.id);
    obs.subscribe(() => this.service.loadAll());
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
      this.service.delete(id).subscribe(() => {
        this.deletingId.set(null);
        this.service.loadAll();
      });
    }
  }

}
