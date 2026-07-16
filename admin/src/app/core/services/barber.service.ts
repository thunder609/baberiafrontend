import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import type { Barber, BarberRequest } from '../models';
import { SupabaseService } from './supabase.service';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BarberService {
  readonly items = signal<Barber[]>([]);
  private apiUrl = `${environment.apiUrl}/api/barbers`;

  constructor(
    private http: HttpClient,
    private supabaseService: SupabaseService
  ) {}

  loadAll(onlyActive = false) {
    const params = onlyActive ? '?onlyActive=true' : '';
    this.http.get<Barber[]>(`${this.apiUrl}${params}`).subscribe((data) => this.items.set(data));
  }

  async create(request: BarberRequest, imageFile?: File): Promise<Barber> {
    let photoUrl = request.photoUrl || '';
    if (imageFile) {
      photoUrl = await this.supabaseService.uploadBarberImage(imageFile, 'new');
    }
    const barberData = { ...request, photoUrl };
    return lastValueFrom(this.http.post<Barber>(this.apiUrl, barberData));
  }

  async update(id: number, request: BarberRequest, imageFile?: File): Promise<Barber> {
    let photoUrl = request.photoUrl || '';
    if (imageFile) {
      photoUrl = await this.supabaseService.uploadBarberImage(imageFile, id.toString());
    }
    const barberData = { ...request, photoUrl };
    return lastValueFrom(this.http.put<Barber>(`${this.apiUrl}/${id}`, barberData));
  }

  async activate(id: number): Promise<void> {
    await lastValueFrom(this.http.patch<void>(`${this.apiUrl}/${id}/activate`, {}));
  }

  async deactivate(id: number): Promise<void> {
    await lastValueFrom(this.http.patch<void>(`${this.apiUrl}/${id}/deactivate`, {}));
  }

  async delete(id: number): Promise<void> {
    await lastValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
