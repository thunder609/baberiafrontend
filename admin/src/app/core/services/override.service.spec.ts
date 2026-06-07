import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { OverrideService } from './override.service';
import type { ScheduleOverride } from '../models';

describe('OverrideService', () => {
  let service: OverrideService;
  let http: HttpTestingController;

  beforeEach(() => {
    service = new OverrideService(TestBed.inject(HttpClient));
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http?.verify();
  });

  it('loadByBarber fetches overrides', () => {
    const mock: ScheduleOverride[] = [
      { id: 1, barberId: 1, date: '2026-06-01', startTime: '09:00', endTime: '18:00', available: false, reason: 'Feriado' },
    ];
    service.loadByBarber(1);
    const req = http.expectOne('/api/barbers/1/overrides');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
    expect(service.items().length).toBe(1);
  });

  it('loadByBarber with date adds param', () => {
    service.loadByBarber(1, '2026-06-01');
    const req = http.expectOne('/api/barbers/1/overrides?date=2026-06-01');
    req.flush([]);
  });

  it('create sends POST request', () => {
    service.create(1, { date: '2026-07-01', startTime: '09:00', endTime: '18:00', available: false, reason: 'Vacaciones' }).subscribe();
    const req = http.expectOne('/api/barbers/1/overrides');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('delete sends DELETE request', () => {
    service.delete(1).subscribe();
    const req = http.expectOne('/api/overrides/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
