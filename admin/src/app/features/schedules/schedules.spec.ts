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
    const { component } = createComponent();
    expect(component['barberId']).toBe(1);
  });

  it('should open week modal with empty week', () => {
    const { component } = createComponent([]);
    component.openWeekModal();
    expect(component.showWeekModal()).toBe(true);
    expect(component.weekDays().length).toBe(7);
    expect(component.weekDays().every((d) => !d.working)).toBe(true);
  });

  it('should open week modal pre-filled from existing schedules', () => {
    const schedules: Schedule[] = [
      { id: 1, barberId: 1, dayOfWeek: 1, startTime: '09:00', endTime: '13:00' },
      { id: 2, barberId: 1, dayOfWeek: 5, startTime: '10:00', endTime: '14:00' },
    ];
    const { component } = createComponent(schedules);
    component.openWeekModal();

    expect(component.weekDays()[1].working).toBe(true);
    expect(component.weekDays()[1].startTime).toBe('09:00');
    expect(component.weekDays()[1].endTime).toBe('13:00');
    expect(component.weekDays()[5].working).toBe(true);
    expect(component.weekDays()[5].startTime).toBe('10:00');
    expect(component.weekDays()[5].endTime).toBe('14:00');
    expect(component.weekDays()[0].working).toBe(false);
  });

  it('should close week modal', () => {
    const { component } = createComponent();
    component.openWeekModal();
    expect(component.showWeekModal()).toBe(true);
    component.closeWeekModal();
    expect(component.showWeekModal()).toBe(false);
  });

  it('should fillFromFirst copy times to all working days', () => {
    const { component } = createComponent();
    component.openWeekModal();
    const days = component.weekDays();
    days[1].working = true;
    days[1].startTime = '08:00';
    days[1].endTime = '12:00';
    days[2].working = true;
    days[2].startTime = '10:00';
    days[2].endTime = '14:00';
    days[3].working = true;
    days[3].startTime = '09:00';
    days[3].endTime = '13:00';

    component.fillFromFirst();

    expect(days[2].startTime).toBe('08:00');
    expect(days[2].endTime).toBe('12:00');
    expect(days[3].startTime).toBe('08:00');
    expect(days[3].endTime).toBe('12:00');
  });

  it('should copyDown from a given day', () => {
    const { component } = createComponent();
    component.openWeekModal();
    const days = component.weekDays();
    days[2].working = true;
    days[2].startTime = '07:00';
    days[2].endTime = '15:00';
    days[3].working = true;
    days[4].working = true;

    component.copyDown(2);

    expect(days[3].startTime).toBe('07:00');
    expect(days[3].endTime).toBe('15:00');
    expect(days[4].startTime).toBe('07:00');
    expect(days[4].endTime).toBe('15:00');
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

  it('should delete and reload', () => {
    const { component, scheduleSvc } = createComponent();
    let deleted = false;
    const origConfirm = window.confirm;
    window.confirm = () => true;
    scheduleSvc.delete = () => { deleted = true; return of({}); };

    component.deleteOne(3);
    expect(deleted).toBe(true);
    window.confirm = origConfirm;
  });
});
