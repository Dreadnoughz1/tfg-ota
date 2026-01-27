import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../models/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(username: string, password: string) {
    this.http
      .post<LoginResponse>(`${this.api}/auth/login`, {
        username,
        password,
      })
      .subscribe((res) => {
        localStorage.setItem('token', res.access_token);
        void this.router.navigate(['/gateways']);
      });
  }

  logout() {
    localStorage.removeItem('token');
    void this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
