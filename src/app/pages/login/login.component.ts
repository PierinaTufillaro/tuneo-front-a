import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.services';


@Component({
  selector: 'app-login',
  imports: [FormsModule], // Import FormsModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onLogin() {
    // Aquí puedes agregar la lógica para iniciar sesiónx
    console.log('Iniciando sesión', this.email, this.password);
    // Luego rediriges a la página principal o dashboard
    const user = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '123456789',
      complex: {
        name: 'Complejo Norte',
        slug: 'complejo-norte',
        address: 'Calle Falsa 123',
        city: 'Buenos Aires',
        province: 'Buenos Aires',
        phone: '123456789',
        email: 'complejo@example.com'
      },
      courts: [
        {
          name: 'Cancha 1',
          sport: 'Fútbol',
          type: 'Sintético',
          price: 2000
        }
      ]
    };
    this.userService.setCurrentUser(user);
    this.router.navigate(['/complex-schedule']);
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}
