import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import type { Client, ClientRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  readonly items = signal<Client[]>([]);

  constructor(private http: HttpClient) {}

  loadAll() {
    this.http.get<Client[]>('/api/clients').subscribe((data) => this.items.set(data));
  }

  create(request: ClientRequest) {
    return this.http.post<Client>('/api/clients', request);
  }

  update(id: number, request: ClientRequest) {
    return this.http.put<Client>(`/api/clients/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete<void>(`/api/clients/${id}`);
  }
}
