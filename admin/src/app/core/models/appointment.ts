export interface Appointment {
  id: number;
  barberId: number;
  clientId: number;
  serviceId: number;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
}

export interface AppointmentRequest {
  barberId: number;
  clientId: number;
  serviceId: number;
  startTime: string;
  endTime?: string;
  notes?: string;
}
