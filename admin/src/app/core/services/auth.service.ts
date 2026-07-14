import { Injectable, signal, computed } from '@angular/core';

export interface AuthUser {
  token: string;
  username: string;
  email: string;
  role: string;
  barberId: number | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'barberia_token';
  private readonly USER_KEY = 'barberia_user';

  private readonly userSignal = signal<AuthUser | null>(null);

  readonly user = computed(() => this.userSignal());
  readonly isLoggedIn = computed(() => this.userSignal() !== null);
  readonly isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');
  readonly isBarber = computed(() => this.userSignal()?.role === 'BARBER');
  readonly barberId = computed(() => this.userSignal()?.barberId ?? null);

  constructor() {
    this.loadFromStorage();
  }

  login(user: AuthUser): void {
    localStorage.setItem(this.TOKEN_KEY, user.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const raw = localStorage.getItem(this.USER_KEY);
    if (token && raw) {
      try {
        this.userSignal.set(JSON.parse(raw));
      } catch {
        this.logout();
      }
    }
  }
}
