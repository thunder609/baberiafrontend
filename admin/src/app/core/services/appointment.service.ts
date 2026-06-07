import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import type { Appointment, AppointmentRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  readonly items = signal<Appointment[]>([]);

  constructor(private http: HttpClient) {}

  loadByBarberAndDate(barberId: number, date: string) {
    this.http
      .get<Appointment[]>(`/api/appointments?barberId=${barberId}&date=${date}`)
      .subscribe({ next: (data) => this.items.set(data), error: () => this.items.set([]) });
  }

  loadByFilter(barberId: number | null, startDate: string, endDate: string) {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    if (barberId != null) {
      params = params.set('barberId', barberId);
    }
    this.http
      .get<Appointment[]>('/api/appointments', { params })
      .subscribe({ next: (data) => this.items.set(data), error: () => this.items.set([]) });
  }

  create(request: AppointmentRequest) {
    return this.http.post<Appointment>('/api/appointments', request);
  }

  confirm(id: number) {
    return this.http.put<Appointment>(`/api/appointments/${id}/confirm`, {});
  }

  start(id: number) {
    return this.http.put<Appointment>(`/api/appointments/${id}/start`, {});
  }

  complete(id: number) {
    return this.http.put<Appointment>(`/api/appointments/${id}/complete`, {});
  }

  cancel(id: number, reason?: string) {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return this.http.put<Appointment>(`/api/appointments/${id}/cancel${params}`, {});
  }

  markNoShow(id: number) {
    return this.http.put<Appointment>(`/api/appointments/${id}/no-show`, {});
  }

  reassign(id: number, clientId: number) {
    return this.http.put<Appointment>(`/api/appointments/${id}/reassign`, { clientId });
  }
}
