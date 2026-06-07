import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { AppointmentService } from './appointment.service';
import type { Appointment } from '../models';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let http: HttpTestingController;

  beforeEach(() => {
    const httpClient = TestBed.inject(HttpClient);
    service = new AppointmentService(httpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http?.verify();
  });

  it('loadByBarberAndDate fetches appointments', () => {
    const mock: Appointment[] = [
      { id: 1, barberId: 1, clientId: 1, serviceId: 2, startTime: '2026-05-30T10:00:00', endTime: '2026-05-30T10:30:00', status: 'PENDING' },
    ];
    service.loadByBarberAndDate(1, '2026-05-30');
    const req = http.expectOne('/api/appointments?barberId=1&date=2026-05-30');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].status).toBe('PENDING');
  });

  it('create sends POST request', () => {
    service.create({ barberId: 1, clientId: 1, serviceId: 2, startTime: '2026-05-30T14:00:00', notes: 'test' }).subscribe();
    const req = http.expectOne('/api/appointments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.notes).toBe('test');
    req.flush({});
  });

  it('confirm sends PUT', () => {
    service.confirm(1).subscribe();
    http.expectOne('/api/appointments/1/confirm').flush({});
  });

  it('start sends PUT', () => {
    service.start(1).subscribe();
    http.expectOne('/api/appointments/1/start').flush({});
  });

  it('complete sends PUT', () => {
    service.complete(1).subscribe();
    http.expectOne('/api/appointments/1/complete').flush({});
  });

  it('cancel sends PUT', () => {
    service.cancel(1, 'client request').subscribe();
    http.expectOne('/api/appointments/1/cancel?reason=client%20request').flush({});
  });

  it('markNoShow sends PUT', () => {
    service.markNoShow(1).subscribe();
    http.expectOne('/api/appointments/1/no-show').flush({});
  });
});
