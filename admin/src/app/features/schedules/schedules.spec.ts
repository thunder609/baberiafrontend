import { describe, it, expect } from 'vitest';
import { signal } from '@angular/core';
import { Schedules } from './schedules';
import { of } from 'rxjs';
import type { Schedule } from '../../core/models';

function mockScheduleService(initial: Schedule[] = []) {
  const items = signal(initial);
  return {
    items,
    loadByBarber: (..._: any[]) => {},
    create: (..._: any[]) => of({}),
    update: (..._: any[]) => of({}),
    delete: (..._: any[]) => of({}),
  };
}

function createComponent(overrides: Schedule[] = []) {
  const scheduleSvc = mockScheduleService(overrides);
  const route = { snapshot: { paramMap: { get: (_key: string) => '1' } } };
  const component = new Schedules(scheduleSvc as any, route as any);
  component.ngOnInit();
  return { component, scheduleSvc };
}

describe('Schedules', () => {
  it('should create', () => {
    const { component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('should load schedules on init', () => {
    const { component, scheduleSvc } = createComponent();
    expect(component['barberId']).toBe(1);
  });

  it('should open and close create modal', () => {
    const { component } = createComponent();
    expect(component.showForm()).toBe(false);
    component.openNew();
    expect(component.showForm()).toBe(true);
    expect(component.editingId()).toBe(null);
    component.closeForm();
    expect(component.showForm()).toBe(false);
  });

  it('should open edit modal with prefilled data', () => {
    const { component } = createComponent();
    component.openEdit({ id: 5, dayOfWeek: 2, startTime: '10:00', endTime: '14:00' });
    expect(component.editingId()).toBe(5);
    expect(component.form.dayOfWeek).toBe(2);
    expect(component.form.startTime).toBe('10:00');
    expect(component.form.endTime).toBe('14:00');
  });

  it('should create new schedule', () => {
    const { component, scheduleSvc } = createComponent();
    let created = false;
    scheduleSvc.create = () => { created = true; return of({}); };

    component.openNew();
    component.save();
    expect(created).toBe(true);
  });

  it('should update existing schedule', () => {
    const { component, scheduleSvc } = createComponent();
    let updated = false;
    scheduleSvc.update = () => { updated = true; return of({}); };

    component.openEdit({ id: 5, dayOfWeek: 2, startTime: '10:00', endTime: '14:00' });
    component.save();
    expect(updated).toBe(true);
  });

  it('should confirm delete and execute', () => {
    const { component, scheduleSvc } = createComponent();
    expect(component.deletingId()).toBe(null);

    component.confirmDelete(3);
    expect(component.deletingId()).toBe(3);

    let deleted = false;
    scheduleSvc.delete = () => { deleted = true; return of({}); };
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

  it('should show empty state when no schedules', () => {
    const { component } = createComponent([]);
    expect(component['scheduleService'].items().length).toBe(0);
  });

  it('should display schedule rows', () => {
    const mockSchedules: Schedule[] = [
      { id: 1, barberId: 1, dayOfWeek: 1, startTime: '09:00', endTime: '13:00' },
      { id: 2, barberId: 1, dayOfWeek: 3, startTime: '14:00', endTime: '18:00' },
    ];
    const { component } = createComponent(mockSchedules);
    expect(component['scheduleService'].items().length).toBe(2);
  });
});
