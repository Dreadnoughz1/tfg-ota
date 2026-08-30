import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService) {}

  login() {
    this.error = '';
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => this.authService.completeLogin(response),
      error: (response) =>
        (this.error =
          response.error?.message ?? 'No se ha podido iniciar sesión.'),
    });
  }
}
