import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; // importa tu componente
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ComplexScheduleComponent } from './pages/complex-schedule/complex-schedule.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent, // cuando vayan a '/', renderiza Home
  },
  {
    path: 'login',
    component: LoginComponent, // cuando vayan a '/', renderiza Home
  },
  {
    path: 'register',
    component: RegisterComponent, // cuando vayan a '/', renderiza Home
  },
  { path: 'edit-profile', component: RegisterComponent },
  { path: 'complex-schedule', component: ComplexScheduleComponent },
  // otras rutas que agregues más adelante
];
