import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { ScheduleService } from './schedule.service';
import type { Schedule } from '../models';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let http: HttpTestingController;

  beforeEach(() => {
    service = new ScheduleService(TestBed.inject(HttpClient));
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http?.verify();
  });

  it('loadByBarber fetches schedules', () => {
    const mock: Schedule[] = [
      { id: 1, barberId: 1, dayOfWeek: 1, startTime: '09:00', endTime: '13:00' },
      { id: 2, barberId: 1, dayOfWeek: 3, startTime: '14:00', endTime: '18:00' },
    ];
    service.loadByBarber(1);
    const req = http.expectOne('/api/barbers/1/schedules');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
    expect(service.items().length).toBe(2);
  });

  it('create sends POST request', () => {
    service.create(1, { dayOfWeek: 2, startTime: '10:00', endTime: '16:00' }).subscribe();
    const req = http.expectOne('/api/barbers/1/schedules');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.dayOfWeek).toBe(2);
    req.flush({});
  });

  it('update sends PUT request', () => {
    service.update(1, { dayOfWeek: 1, startTime: '10:00', endTime: '14:00' }).subscribe();
    const req = http.expectOne('/api/schedules/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.endTime).toBe('14:00');
    req.flush({});
  });

  it('delete sends DELETE request', () => {
    service.delete(1).subscribe();
    const req = http.expectOne('/api/schedules/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
