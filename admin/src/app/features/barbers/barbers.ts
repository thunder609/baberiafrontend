import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BarberService } from '../../core/services/barber.service';
import type { Barber, BarberRequest } from '../../core/models';

@Component({
  selector: 'app-barbers',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-5xl">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold tracking-tight text-barber-dark">Barberos</h2>
        <button
          (click)="openNew()"
          class="rounded-md bg-barber-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
        >
          + Nuevo barbero
        </button>
      </div>

      <div class="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-stone-200 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-barber-muted">
              <th class="px-4 py-3 pl-5">Barbero</th>
              <th class="px-4 py-3">Contacto</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3 text-right pr-5">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (barber of service.items(); track barber.id) {
              <tr class="border-b border-stone-100 transition hover:bg-stone-50">
                <td class="whitespace-nowrap px-4 py-3 pl-5">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-stone-100">
                      @if (barber.photoUrl) {
                        <img [src]="barber.photoUrl" alt="" class="h-full w-full object-cover" />
                      } @else {
                        <div class="flex h-full items-center justify-center text-sm font-medium text-stone-400">
                          {{ barber.name.charAt(0).toUpperCase() }}
                        </div>
                      }
                    </div>
                    <div>
                      <p class="font-medium text-barber-dark">{{ barber.name }}</p>
                      <p class="text-xs text-barber-muted">@if (barber.active) { Activo } @else { Inactivo }</p>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <p class="text-barber-dark">{{ barber.phone || '—' }}</p>
                  <p class="text-xs text-barber-muted">{{ barber.email || '—' }}</p>
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <button (click)="toggleActive(barber)"
                    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition"
                    [class.bg-emerald-50]="barber.active"
                    [class.text-emerald-700]="barber.active"
                    [class.hover:bg-emerald-100]="barber.active"
                    [class.bg-stone-100]="!barber.active"
                    [class.text-stone-500]="!barber.active"
                    [class.hover:bg-stone-200]="!barber.active"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" [class.bg-emerald-500]="barber.active" [class.bg-stone-400]="!barber.active"></span>
                    {{ barber.active ? 'Activo' : 'Inactivo' }}
                  </button>
                </td>
                <td class="whitespace-nowrap px-4 py-3 pr-5">
                  <div class="flex items-center justify-end gap-1">
                    <button (click)="openEdit(barber)"
                      class="rounded-lg p-2 text-stone-400 transition hover:bg-amber-50 hover:text-amber-600"
                      title="Editar barbero">
                      <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <a [routerLink]="['/barbers', barber.id, 'schedules']"
                      class="rounded-lg p-2 text-stone-400 transition hover:bg-amber-50 hover:text-amber-600"
                      title="Horarios">
                      <i class="fa-regular fa-clock"></i>
                    </a>
                    <a [routerLink]="['/barbers', barber.id, 'overrides']"
                      class="rounded-lg p-2 text-stone-400 transition hover:bg-amber-50 hover:text-amber-600"
                      title="Excepciones">
                      <i class="fa-regular fa-calendar-xmark"></i>
                    </a>
                    <button (click)="deleteBarber(barber)"
                      class="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Eliminar barbero">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-4 py-16 text-center text-sm text-barber-muted">
                  <p class="mb-2 text-2xl">✂️</p>
                  <p>No hay barberos cargados todavía.</p>
                  <button (click)="openNew()" class="mt-3 text-sm font-medium text-barber-accent hover:text-amber-700">
                    + Crear primer barbero
                  </button>
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
            {{ editingId() ? 'Editar barbero' : 'Nuevo barbero' }}
          </h3>

          <!-- Foto -->
          <div class="mb-4 text-center">
            <div class="mx-auto mb-2 h-24 w-24 overflow-hidden rounded-full bg-stone-100">
              @if (previewUrl()) {
                <img [src]="previewUrl()" alt="Foto" class="h-full w-full object-cover" />
              } @else {
                <div class="flex h-full items-center justify-center text-2xl text-stone-300">
                  <i class="fa-regular fa-user"></i>
                </div>
              }
            </div>
            <label class="cursor-pointer rounded-md bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-200">
              Subir foto
              <input type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)" />
            </label>
            @if (uploading()) {
              <p class="mt-1 text-xs text-stone-400">Subiendo…</p>
            }
          </div>

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
            <button (click)="save()" [disabled]="uploading()" class="rounded-lg bg-barber-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-60">
              Guardar
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class Barbers implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly form: BarberRequest = { name: '', phone: '', email: '', photoUrl: '' };
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly uploading = signal(false);

  constructor(protected service: BarberService) {}

  ngOnInit() {
    this.service.loadAll();
  }

  protected openNew() {
    this.form.name = '';
    this.form.phone = '';
    this.form.email = '';
    this.form.photoUrl = '';
    this.previewUrl.set(null);
    this.editingId.set(null);
    this.showForm.set(true);
  }

  protected openEdit(barber: Barber) {
    this.form.name = barber.name;
    this.form.phone = barber.phone;
    this.form.email = barber.email;
    this.form.photoUrl = barber.photoUrl;
    this.previewUrl.set(barber.photoUrl || null);
    this.editingId.set(barber.id);
    this.showForm.set(true);
  }

  protected closeForm() {
    this.showForm.set(false);
  }

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Preview local
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);

    // Subir al backend
    this.uploading.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/upload', formData).subscribe({
      next: (res) => {
        this.form.photoUrl = res.url;
        this.uploading.set(false);
      },
      error: () => {
        this.uploading.set(false);
      },
    });
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

  protected toggleActive(barber: Barber) {
    const obs = barber.active
      ? this.service.deactivate(barber.id)
      : this.service.activate(barber.id);
    obs.subscribe(() => this.service.loadAll());
  }

  protected deleteBarber(barber: Barber) {
    if (!confirm(`¿Eliminar a ${barber.name}? Esta acción no se puede deshacer.`)) return;
    this.service.delete(barber.id).subscribe(() => this.service.loadAll());
  }
}
