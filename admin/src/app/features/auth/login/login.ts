import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="flex min-h-dvh items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 p-4">
      <div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl">
        <div class="mb-6 text-center">
          <div class="mb-2 text-4xl">✂</div>
          <h1 class="text-xl font-bold tracking-tight text-stone-900">Front Barbería</h1>
          <p class="mt-1 text-sm text-stone-500">Iniciá sesión para administrar</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <div>
            <label for="username" class="mb-1 block text-xs font-medium text-stone-600">Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              [(ngModel)]="username"
              required
              autocomplete="username"
              class="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="admin"
            />
          </div>

          <div>
            <label for="password" class="mb-1 block text-xs font-medium text-stone-600">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              [(ngModel)]="password"
              required
              autocomplete="current-password"
              class="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="••••••••"
            />
          </div>

          @if (error()) {
            <p class="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{{ error() }}</p>
          }

          <a routerLink="/forgot-password" class="text-right text-xs text-stone-500 hover:text-amber-600 transition">
            Olvidé mi contraseña
          </a>

          <button
            type="submit"
            [disabled]="loading()"
            class="mt-2 w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-wait disabled:opacity-60"
          >
            @if (loading()) {
              <span class="inline-block animate-spin">⏳</span> Ingresando…
            } @else {
              Ingresar
            }
          </button>
        </form>
      </div>
    </div>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected username = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (!this.username || !this.password) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await fetch(`${environment.apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.username, password: this.password }),
      });

      if (!res.ok) {
        const err = await res.json();
        this.error.set(err.message || 'Error al iniciar sesión');
        return;
      }

      const data = await res.json();
      this.auth.login({ token: data.token, username: data.username, email: data.email, role: data.role, barberId: data.barberId ?? null });
      await this.router.navigate(['/']);
    } catch {
      this.error.set('No se pudo conectar con el servidor');
    } finally {
      this.loading.set(false);
    }
  }
}
