import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Sidebar } from './sidebar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar],
  template: `
    <div class="flex h-dvh">
      @if (sidebarOpen()) {
        <div
          class="fixed inset-0 z-20 bg-black/50 lg:hidden"
          (click)="sidebarOpen.set(false)"
        ></div>
      }

      <app-sidebar [open]="sidebarOpen()" (close)="sidebarOpen.set(false)" />

      <main class="flex min-w-0 flex-1 flex-col overflow-auto">
        <header class="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
          <div class="flex items-center gap-3">
            <button
              (click)="sidebarOpen.set(!sidebarOpen())"
              class="rounded-md p-2 text-stone-600 transition hover:bg-stone-200"
              aria-label="Menú"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span class="text-sm font-semibold tracking-tight text-barber-dark">Front Barbería</span>
          </div>
          <button
            (click)="logout()"
            class="rounded-md px-2 py-1 text-xs text-stone-500 transition hover:text-red-600"
            title="Cerrar sesión"
          >
            Salir
          </button>
        </header>

        <div class="flex-1 overflow-auto p-6">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
})
export class Shell {
  protected readonly sidebarOpen = signal(false);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
