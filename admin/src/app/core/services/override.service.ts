import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import type { ScheduleOverride, OverrideRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class OverrideService {
  readonly items = signal<ScheduleOverride[]>([]);

  constructor(private http: HttpClient) {}

  loadByBarber(barberId: number, date?: string) {
    const params = date ? `?date=${date}` : '';
    this.http
      .get<ScheduleOverride[]>(`/api/barbers/${barberId}/overrides${params}`)
      .subscribe((data) => this.items.set(data));
  }

  create(barberId: number, request: OverrideRequest) {
    return this.http.post<ScheduleOverride>(`/api/barbers/${barberId}/overrides`, request);
  }

  delete(id: number) {
    return this.http.delete<void>(`/api/overrides/${id}`);
  }
}
