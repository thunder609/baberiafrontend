import { describe, it, expect } from 'vitest';
import { signal } from '@angular/core';
import { Overrides } from './overrides';
import { of } from 'rxjs';
import type { ScheduleOverride } from '../../core/models';

function mockOverrideService(initial: ScheduleOverride[] = []) {
  const items = signal(initial);
  return {
    items,
    loadByBarber: (..._: any[]) => {},
    create: (..._: any[]) => of({}),
    delete: (..._: any[]) => of({}),
  };
}

function createComponent(overrides: ScheduleOverride[] = []) {
  const overrideSvc = mockOverrideService(overrides);
  const route = { snapshot: { paramMap: { get: (_key: string) => '2' } } };
  const component = new Overrides(overrideSvc as any, route as any);
  component.ngOnInit();
  return { component, overrideSvc };
}

describe('Overrides', () => {
  it('should create', () => {
    const { component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('should load overrides on init', () => {
    const { component } = createComponent();
    expect(component['barberId']).toBe(2);
  });

  it('should open and close create modal', () => {
    const { component } = createComponent();
    expect(component.showForm()).toBe(false);
    component.openNew();
    expect(component.showForm()).toBe(true);
    component.closeForm();
    expect(component.showForm()).toBe(false);
  });

  it('should create new override', () => {
    const { component, overrideSvc } = createComponent();
    let created = false;
    overrideSvc.create = () => { created = true; return of({}); };

    component.openNew();
    component.save();
    expect(created).toBe(true);
  });

  it('should confirm delete and execute', () => {
    const { component, overrideSvc } = createComponent();
    expect(component.deletingId()).toBe(null);

    component.confirmDelete(5);
    expect(component.deletingId()).toBe(5);

    let deleted = false;
    overrideSvc.delete = () => { deleted = true; return of({}); };
    component.doDelete();
    expect(deleted).toBe(true);
    expect(component.deletingId()).toBe(null);
  });

  it('should cancel delete', () => {
    const { component } = createComponent();
    component.confirmDelete(3);
    component.cancelDelete();
    expect(component.deletingId()).toBe(null);
  });

  it('should set form defaults on openNew', () => {
    const { component } = createComponent();
    component.openNew();
    expect(component.form.available).toBe(true);
    expect(component.form.reason).toBe('');
    expect(component.form.startTime).toBe('09:00');
    expect(component.form.endTime).toBe('18:00');
  });

  it('should display overrides data', () => {
    const mockOverrides: ScheduleOverride[] = [
      { id: 1, barberId: 2, date: '2026-06-01', startTime: '09:00', endTime: '18:00', available: false, reason: 'Feriado' },
    ];
    const { component } = createComponent(mockOverrides);
    expect(component['overrideService'].items().length).toBe(1);
    expect(component['overrideService'].items()[0].reason).toBe('Feriado');
  });

  it('should show empty state', () => {
    const { component } = createComponent([]);
    expect(component['overrideService'].items().length).toBe(0);
  });
});
