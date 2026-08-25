import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GatewayService {
  constructor(private http: HttpClient) {}

  getAll() {
    const dto = {
      orderBy: 'name',
      order: 'ASC',
      page: 1,
      limit: 100,
      searchText: '',
    };
    const params = new HttpParams({ fromObject: dto });
    return this.http.get<any>(`${environment.apiUrl}/gateways`, {
      params: params,
    });
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/gateways/${id}`);
  }

  create(payload: { name: string; location: string; connectorsId: number[]; machinesId: number[] }) {
    return this.http.post(`${environment.apiUrl}/gateways`, payload);
  }

  update(id: number, payload: Partial<{ name: string; location: string }>) {
    return this.http.patch(`${environment.apiUrl}/gateways/${id}`, payload);
  }
}
