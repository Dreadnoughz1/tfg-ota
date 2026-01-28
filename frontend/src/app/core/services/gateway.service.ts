import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GatewayService {
  constructor(private http: HttpClient) {}

  getAll() {
    console.log('Fetching gateways from backend');
    return this.http.get<any[]>('http://localhost:3000/gateways');
  }

  delete(id: number) {
    return this.http.delete(`http://localhost:3000/gateways/${id}`);
  }
}
