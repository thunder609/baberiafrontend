import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  styles: [
    `
      :host aside {
        transform: translateX(-100%);
      }
      :host aside.open {
        transform: translateX(0);
      }
      @media (width >= 64rem) {
        :host aside {
          position: static;
          transform: translateX(0);
        }
      }
    `,
  ],
  template: `
    <aside
      class="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-barber-mid bg-barber-dark p-4 transition-transform duration-200"
      [class.open]="open()"
    >
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold tracking-wider text-barber-accent">✂</span>
          <h1 class="text-lg font-bold tracking-tight text-stone-100">Front Barbería</h1>
        </div>
        <button
          (click)="close.emit()"
          class="rounded-md p-1 text-stone-400 transition hover:bg-barber-mid lg:hidden"
          aria-label="Cerrar menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav class="flex flex-col gap-0.5">
        @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            (click)="close.emit()"
            routerLinkActive="bg-barber-mid text-barber-accent font-medium"
            class="rounded-md px-3 py-2 text-sm text-stone-300 transition hover:bg-barber-mid hover:text-stone-100"
          >
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="mt-auto border-t border-barber-mid pt-3">
        <div class="mb-2 px-3 text-xs text-stone-500">
          {{ auth.user()?.username }}
        </div>
        <a
          [routerLink]="'/change-password'"
          (click)="close.emit()"
          class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-400 transition hover:bg-barber-mid hover:text-stone-100"
        >
          Cambiar contraseña
        </a>
        <button
          (click)="logout()"
          class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-400 transition hover:bg-barber-mid hover:text-red-400"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  `,
})
export class Sidebar {
  readonly open = input(false);
  readonly close = output();
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/clients', label: 'Clientes' },
    { path: '/barbers', label: 'Barberos' },
    { path: '/services', label: 'Servicios' },
    { path: '/appointments', label: 'Turnos' },
  ];

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
    this.close.emit();
  }
}
