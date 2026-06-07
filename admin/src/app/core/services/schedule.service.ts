import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import type { Schedule, ScheduleRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  readonly items = signal<Schedule[]>([]);

  constructor(private http: HttpClient) {}

  loadByBarber(barberId: number) {
    this.http
      .get<Schedule[]>(`/api/barbers/${barberId}/schedules`)
      .subscribe((data) => this.items.set(data));
  }

  create(barberId: number, request: ScheduleRequest) {
    return this.http.post<Schedule>(`/api/barbers/${barberId}/schedules`, request);
  }

  update(id: number, request: ScheduleRequest) {
    return this.http.put<Schedule>(`/api/schedules/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete<void>(`/api/schedules/${id}`);
  }
}
