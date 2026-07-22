import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import type { BarberService, ServiceRequest } from '../models';
import { SupabaseService } from './supabase.service';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  readonly items = signal<BarberService[]>([]);

  constructor(
    private http: HttpClient,
    private supabase: SupabaseService,
  ) {}

  loadAll(onlyActive = false) {
    const params = onlyActive ? '?onlyActive=true' : '';
    this.http.get<BarberService[]>(`/api/services${params}`).subscribe((data) => this.items.set(data));
  }

  async uploadImage(file: File): Promise<string> {
    return this.supabase.uploadImage(file, 'services/');
  }

  async create(request: ServiceRequest): Promise<BarberService> {
    return lastValueFrom(this.http.post<BarberService>('/api/services', request));
  }

  async update(id: number, request: ServiceRequest): Promise<BarberService> {
    return lastValueFrom(this.http.put<BarberService>(`/api/services/${id}`, request));
  }

  async activate(id: number): Promise<void> {
    await lastValueFrom(this.http.patch<void>(`/api/services/${id}/activate`, {}));
  }

  async deactivate(id: number): Promise<void> {
    await lastValueFrom(this.http.patch<void>(`/api/services/${id}/deactivate`, {}));
  }

  async delete(id: number): Promise<void> {
    await lastValueFrom(this.http.delete<void>(`/api/services/${id}`));
  }
}
