export interface Barber {
  id: number;
  name: string;
  phone: string;
  email: string;
  active: boolean;
}

export interface BarberRequest {
  name: string;
  phone: string;
  email: string;
}
