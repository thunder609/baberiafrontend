import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="flex min-h-dvh items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 p-4">
      <div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl">
        <div class="mb-6 text-center">
          <div class="mb-2 text-4xl">🔐</div>
          <h1 class="text-xl font-bold tracking-tight text-stone-900">Recuperar contraseña</h1>
          <p class="mt-1 text-sm text-stone-500">Te enviamos un link al email registrado</p>
        </div>

        @if (sent()) {
          <div class="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            Si el email está registrado, recibirás un link de recuperación en los próximos minutos.
          </div>
          <a routerLink="/login" class="block text-center text-sm font-medium text-amber-600 hover:text-amber-700">
            Volver al inicio de sesión
          </a>
        } @else {
          <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <div>
              <label for="email" class="mb-1 block text-xs font-medium text-stone-600">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                [(ngModel)]="email"
                required
                autocomplete="email"
                class="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="admin@barberia.com"
              />
            </div>

            @if (error()) {
              <p class="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{{ error() }}</p>
            }

            <button
              type="submit"
              [disabled]="loading()"
              class="mt-2 w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-wait disabled:opacity-60"
            >
              @if (loading()) {
                <span class="inline-block animate-spin">⏳</span> Enviando…
              } @else {
                Enviar link de recuperación
              }
            </button>

            <a routerLink="/login" class="mt-2 block text-center text-xs text-stone-500 hover:text-stone-700">
              Volver al inicio de sesión
            </a>
          </form>
        }
      </div>
    </div>
  `,
})
export class ForgotPassword {
  protected email = '';
  protected readonly loading = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (!this.email) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await fetch(`${environment.apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email }),
      });

      if (!res.ok) {
        const err = await res.json();
        this.error.set(err.error || 'Error al enviar solicitud');
        return;
      }

      this.sent.set(true);
    } catch {
      this.error.set('No se pudo conectar con el servidor');
    } finally {
      this.loading.set(false);
    }
  }
}
