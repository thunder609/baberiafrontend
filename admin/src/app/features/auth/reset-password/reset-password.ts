import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="flex min-h-dvh items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 p-4">
      <div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl">
        <div class="mb-6 text-center">
          <div class="mb-2 text-4xl">🔐</div>
          <h1 class="text-xl font-bold tracking-tight text-stone-900">Nueva contraseña</h1>
          <p class="mt-1 text-sm text-stone-500">Ingresá tu nueva contraseña</p>
        </div>

        @if (success()) {
          <div class="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            Contraseña actualizada correctamente. Ya podés iniciar sesión.
          </div>
          <a routerLink="/login" class="block text-center text-sm font-medium text-amber-600 hover:text-amber-700">
            Ir al inicio de sesión
          </a>
        } @else if (!token()) {
          <div class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            Link inválido. Solicitá un nuevo restablecimiento de contraseña.
          </div>
          <a routerLink="/forgot-password" class="block text-center text-sm font-medium text-amber-600 hover:text-amber-700">
            Solicitar nuevo link
          </a>
        } @else {
          <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <div>
              <label for="new-password" class="mb-1 block text-xs font-medium text-stone-600">Nueva contraseña</label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                [(ngModel)]="newPassword"
                required
                minlength="6"
                autocomplete="new-password"
                class="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label for="confirm-password" class="mb-1 block text-xs font-medium text-stone-600">Confirmar contraseña</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                [(ngModel)]="confirmPassword"
                required
                autocomplete="new-password"
                class="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="••••••••"
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
                <span class="inline-block animate-spin">⏳</span> Guardando…
              } @else {
                Guardar nueva contraseña
              }
            </button>
          </form>
        }
      </div>
    </div>
  `,
})
export class ResetPassword implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly token = signal<string | null>(null);
  protected newPassword = '';
  protected confirmPassword = '';
  protected readonly loading = signal(false);
  protected readonly success = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.token.set(this.route.snapshot.queryParamMap.get('token'));
  }

  async onSubmit(): Promise<void> {
    const t = this.token();
    if (!t || !this.newPassword || !this.confirmPassword) return;

    if (this.newPassword !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    if (this.newPassword.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await fetch(`${environment.apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t, newPassword: this.newPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        this.error.set(err.error || 'Error al restablecer contraseña');
        return;
      }

      this.success.set(true);
    } catch {
      this.error.set('No se pudo conectar con el servidor');
    } finally {
      this.loading.set(false);
    }
  }
}
