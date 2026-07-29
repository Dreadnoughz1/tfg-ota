import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GatewayService {
  constructor(private http: HttpClient) {}

  getAll() {
    console.log('Fetching gateways from backend');
    const dto = {
      orderBy: 'name',
      order: 'ASC',
      page: 1,
      limit: 100,
      searchText: '',
    };
    const params = new HttpParams({ fromObject: dto });
    console.log('Params:', params.toString());
    return this.http.get<any>('http://localhost:3000/gateways', {
      params: params,
    });
  }

  delete(id: number) {
    return this.http.delete(`http://localhost:3000/gateways/${id}`);
  }
}
