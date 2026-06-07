import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule],
  template: `
    <div class="mx-auto max-w-md">
      <h2 class="mb-6 text-lg font-bold tracking-tight text-stone-800">Cambiar contraseña</h2>

      <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <div>
          <label for="currentPassword" class="mb-1 block text-xs font-medium text-stone-600">
            Contraseña actual
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            [(ngModel)]="currentPassword"
            required
            autocomplete="current-password"
            class="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label for="newPassword" class="mb-1 block text-xs font-medium text-stone-600">
            Nueva contraseña
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            [(ngModel)]="newPassword"
            required
            minlength="6"
            autocomplete="new-password"
            class="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          @if (newPassword && newPassword.length < 6) {
            <p class="mt-1 text-xs text-red-500">Mínimo 6 caracteres</p>
          }
        </div>

        <div>
          <label for="confirmPassword" class="mb-1 block text-xs font-medium text-stone-600">
            Repetir nueva contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            [(ngModel)]="confirmPassword"
            required
            autocomplete="new-password"
            class="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        @if (error()) {
          <p class="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{{ error() }}</p>
        }

        @if (success()) {
          <p class="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
            Contraseña cambiada correctamente
          </p>
        }

        <button
          type="submit"
          [disabled]="loading()"
          class="w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-wait disabled:opacity-60"
        >
          @if (loading()) {
            Cambiando…
          } @else {
            Cambiar contraseña
          }
        </button>
      </form>
    </div>
  `,
})
export class ChangePassword {
  private readonly auth = inject(AuthService);

  protected currentPassword = '';
  protected newPassword = '';
  protected confirmPassword = '';
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal(false);

  async onSubmit(): Promise<void> {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) return;

    if (this.newPassword !== this.confirmPassword) {
      this.error.set('Las contraseñas nuevas no coinciden');
      return;
    }

    if (this.newPassword.length < 6) {
      this.error.set('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    try {
      const token = this.auth.getToken();
      if (!token) {
        this.error.set('No autenticado');
        return;
      }

      const res = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        this.error.set(err.message || 'Error al cambiar la contraseña');
        return;
      }

      this.success.set(true);
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } catch {
      this.error.set('No se pudo conectar con el servidor');
    } finally {
      this.loading.set(false);
    }
  }
}
