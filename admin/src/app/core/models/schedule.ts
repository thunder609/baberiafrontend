export interface Schedule {
  id: number;
  barberId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ScheduleRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}
