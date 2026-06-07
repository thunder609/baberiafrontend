export interface ScheduleOverride {
  id: number;
  barberId: number;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  reason?: string;
}

export interface OverrideRequest {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  reason?: string;
}
