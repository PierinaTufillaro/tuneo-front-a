import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, MatIconModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  onLogin() {
    console.log('Starting sesion', this.email, this.password);

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.access_token);
        this.authService.setCurrentUser(response.user);
        this.router.navigate(['/complex-schedule']);
      },
      error: (err) => {
        console.error('Error in login:', err);
      },
    });
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  goBack() {
    this.location.back();
  }
}
