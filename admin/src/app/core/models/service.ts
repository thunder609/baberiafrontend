export interface BarberService {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  imageUrl: string;
}

export interface ServiceRequest {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl: string;
}
