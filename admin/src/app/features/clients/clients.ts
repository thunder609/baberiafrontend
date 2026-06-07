import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import type { Client, ClientRequest } from '../../core/models';

@Component({
  selector: 'app-clients',
  imports: [FormsModule],
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold tracking-tight text-barber-dark">Clientes</h2>
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
              <th class="px-4 py-3">Teléfono</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            @for (client of service.items(); track client.id) {
              <tr class="border-b border-stone-100 transition hover:bg-stone-50">
                <td class="px-4 py-3 font-medium text-barber-dark">{{ client.name }}</td>
                <td class="px-4 py-3 text-barber-muted">{{ client.phone }}</td>
                <td class="px-4 py-3 text-barber-muted">{{ client.email }}</td>
                <td class="px-4 py-3 text-right">
                  <button (click)="openEdit(client)" class="mr-2 text-xs font-medium text-barber-accent hover:text-amber-700">
                    Editar
                  </button>
                  <button (click)="confirmDelete(client)" class="text-xs font-medium text-red-500 hover:text-red-700">
                    Eliminar
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-4 py-12 text-center text-sm text-barber-muted">
                  No hay clientes cargados.
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
          <h3 class="mb-5 text-base font-bold text-barber-dark">
            {{ editingId() ? 'Editar cliente' : 'Nuevo cliente' }}
          </h3>
          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Nombre</label>
            <input [(ngModel)]="form.name" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark placeholder-stone-400 transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
          </div>
          <div class="mb-3">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Teléfono</label>
            <input [(ngModel)]="form.phone" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark placeholder-stone-400 transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
          </div>
          <div class="mb-5">
            <label class="mb-1 block text-xs font-medium text-barber-muted">Email</label>
            <input [(ngModel)]="form.email" type="email" class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-barber-dark placeholder-stone-400 transition focus:border-barber-accent focus:outline-none focus:ring-1 focus:ring-barber-accent" />
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
export class Clients implements OnInit {
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly form: ClientRequest = { name: '', phone: '', email: '' };

  constructor(protected service: ClientService) {}

  ngOnInit() {
    this.service.loadAll();
  }

  protected openNew() {
    this.form.name = '';
    this.form.phone = '';
    this.form.email = '';
    this.editingId.set(null);
    this.showForm.set(true);
  }

  protected openEdit(client: Client) {
    this.form.name = client.name;
    this.form.phone = client.phone;
    this.form.email = client.email;
    this.editingId.set(client.id);
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

  protected confirmDelete(client: Client) {
    if (confirm(`¿Eliminar a ${client.name}?`)) {
      this.service.delete(client.id).subscribe(() => this.service.loadAll());
    }
  }
}
