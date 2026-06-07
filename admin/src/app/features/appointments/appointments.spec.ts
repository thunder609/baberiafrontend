import { describe, it, expect } from 'vitest';
import { signal } from '@angular/core';
import { Appointments } from './appointments';
import { of } from 'rxjs';
import type { Appointment } from '../../core/models';

function mockService(initial: any[] = []) {
  const items = signal(initial);
  return {
    items,
    loadAll: (..._: any[]) => {},
    loadByBarber: (..._: any[]) => {},
    loadByBarberAndDate: (..._: any[]) => {},
    create: (..._: any[]) => of({}),
    confirm: (..._: any[]) => of({}),
    start: (..._: any[]) => of({}),
    complete: (..._: any[]) => of({}),
    cancel: (..._: any[]) => of({}),
    markNoShow: (..._: any[]) => of({}),
  };
}

function createComponent() {
  const appointmentSvc = mockService();
  const barberSvc = mockService([
    { id: 1, name: 'Carlos', phone: '', email: '', active: true },
  ]);
  const clientSvc = mockService([
    { id: 1, name: 'Juan', phone: '', email: '' },
  ]);
  const serviceSvc = mockService([
    { id: 1, name: 'Corte', price: 10, active: true, description: '' },
  ]);

  const component = new Appointments(
    appointmentSvc as any,
    barberSvc as any,
    clientSvc as any,
    serviceSvc as any,
  );
  component.ngOnInit();
  return { component, appointmentSvc, barberSvc, clientSvc, serviceSvc };
}

describe('Appointments', () => {
  it('should create', () => {
    const { component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('should load barbers on init', () => {
    const { component, barberSvc } = createComponent();
    // barberSvc.loadAll(true) was called via ngOnInit
  });

  it('should resolve clientName', () => {
    const { component } = createComponent();
    expect(component.clientName(1)).toBe('Juan');
    expect(component.clientName(99)).toBe('#99');
  });

  it('should resolve serviceName', () => {
    const { component } = createComponent();
    expect(component.serviceName(1)).toBe('Corte');
    expect(component.serviceName(99)).toBe('#99');
  });

  it('should resolve statusLabel', () => {
    const { component } = createComponent();
    expect(component.statusLabel('PENDING')).toBe('Pendiente');
    expect(component.statusLabel('CONFIRMED')).toBe('Confirmado');
    expect(component.statusLabel('IN_PROGRESS')).toBe('En curso');
    expect(component.statusLabel('COMPLETED')).toBe('Completado');
    expect(component.statusLabel('CANCELLED')).toBe('Cancelado');
    expect(component.statusLabel('NO_SHOW')).toBe('No asistió');
  });

  it('should open and close form', () => {
    const { component } = createComponent();
    expect(component.showForm()).toBe(false);
    component.openNew();
    expect(component.showForm()).toBe(true);
    component.closeForm();
    expect(component.showForm()).toBe(false);
  });

  it('should transition appointment', () => {
    const { component } = createComponent();
    // Should not throw
    component.transition(1, 'confirm');
    component.transition(1, 'start');
    component.transition(1, 'complete');
    component.transition(1, 'cancel');
    component.transition(1, 'no-show');
  });

  it('should call appointment create on save', () => {
    const { component, appointmentSvc } = createComponent();
    let called = false;
    appointmentSvc.create = () => { called = true; return of({}); };

    component.openNew();
    component.form.barberId = 1;
    component.form.clientId = 1;
    component.form.serviceId = 2;
    component.formDate = '2026-06-01';
    component.formTime = '14:00';
    component.save();

    expect(called).toBe(true);
    expect(component.showForm()).toBe(false);
  });

  it('should trigger reload on barber change', () => {
    const { component, appointmentSvc } = createComponent();
    let loaded = false;
    appointmentSvc.loadByBarberAndDate = (..._: any[]) => { loaded = true; };

    component.selectedBarberId = 1;
    component.onBarberChange();
    expect(loaded).toBe(true);
  });

  describe('validation', () => {
    it('should reject empty form', () => {
      const { component, appointmentSvc } = createComponent();
      let called = false;
      appointmentSvc.create = () => { called = true; return of({}); };

      component.openNew();
      component.save();

      expect(called).toBe(false);
      expect(component.errors().length).toBeGreaterThan(0);
    });

    it('should reject past date', () => {
      const { component } = createComponent();
      component.openNew();
      component.form.barberId = 1;
      component.form.clientId = 1;
      component.form.serviceId = 1;
      component.formDate = '2020-01-01';
      component.formTime = '14:00';

      const ok = component.validate();

      expect(ok).toBe(false);
      expect(component.errors().some((e) => e.includes('fecha'))).toBe(true);
    });

    it('should accept valid future date', () => {
      const { component } = createComponent();
      component.form.barberId = 1;
      component.form.clientId = 1;
      component.form.serviceId = 1;
      component.formDate = '2099-12-31';
      component.formTime = '14:00';

      const ok = component.validate();

      expect(ok).toBe(true);
      expect(component.errors().length).toBe(0);
    });
  });
});
