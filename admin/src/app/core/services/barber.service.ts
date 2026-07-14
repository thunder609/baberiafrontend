import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import type { Barber, BarberRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class BarberService {
  readonly items = signal<Barber[]>([]);

  constructor(private http: HttpClient) {}

  loadAll(onlyActive = false) {
    const params = onlyActive ? '?onlyActive=true' : '';
    this.http.get<Barber[]>(`/api/barbers${params}`).subscribe((data) => this.items.set(data));
  }

  create(request: BarberRequest) {
    return this.http.post<Barber>('/api/barbers', request);
  }

  update(id: number, request: BarberRequest) {
    return this.http.put<Barber>(`/api/barbers/${id}`, request);
  }

  activate(id: number) {
    return this.http.patch<void>(`/api/barbers/${id}/activate`, {});
  }

  deactivate(id: number) {
    return this.http.patch<void>(`/api/barbers/${id}/deactivate`, {});
  }

  delete(id: number) {
    return this.http.delete<void>(`/api/barbers/${id}`);
  }
}
