import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  constructor(private http: HttpClient) {}

  list<T>(resource: 'connectors' | 'machines', searchText = '') {
    const params = new HttpParams({
      fromObject: { orderBy: 'name', order: 'ASC', page: '1', limit: '200', searchText },
    });
    return this.http.get<any>(`${environment.apiUrl}/${resource}`, { params });
  }

  create<T>(resource: string, payload: unknown) {
    return this.http.post<T>(`${environment.apiUrl}/${resource}`, payload);
  }

  update<T>(resource: string, id: number, payload: unknown) {
    return this.http.patch<T>(`${environment.apiUrl}/${resource}/${id}`, payload);
  }

  remove(resource: string, id: number) {
    return this.http.delete(`${environment.apiUrl}/${resource}/${id}`);
  }

  latestAlerts(limit = 50) {
    return this.http.get<any[]>(`${environment.apiUrl}/alerts/latest`, { params: { limit } });
  }

  alertsForMachine(machineId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/alerts/machine/${machineId}`);
  }
}
