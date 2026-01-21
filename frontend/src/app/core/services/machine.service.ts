import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MachineService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>('http://localhost:3000/machines');
  }

  delete(id: number) {
    return this.http.delete(`http://localhost:3000/machines/${id}`);
  }
}
