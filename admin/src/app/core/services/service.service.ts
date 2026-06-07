import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import type { BarberService, ServiceRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  readonly items = signal<BarberService[]>([]);

  constructor(private http: HttpClient) {}

  loadAll(onlyActive = false) {
    const params = onlyActive ? '?onlyActive=true' : '';
    this.http.get<BarberService[]>(`/api/services${params}`).subscribe((data) => this.items.set(data));
  }

  create(request: ServiceRequest) {
    return this.http.post<BarberService>('/api/services', request);
  }

  update(id: number, request: ServiceRequest) {
    return this.http.put<BarberService>(`/api/services/${id}`, request);
  }

  activate(id: number) {
    return this.http.patch<void>(`/api/services/${id}/activate`, {});
  }

  deactivate(id: number) {
    return this.http.patch<void>(`/api/services/${id}/deactivate`, {});
  }

  delete(id: number) {
    return this.http.delete<void>(`/api/services/${id}`);
  }
}
