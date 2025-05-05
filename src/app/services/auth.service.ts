// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // esto asegura que el servicio sea singleton
})
export class AuthService {
  private _currentUser: any = null;
  private apiUrl = 'http://localhost:8000'; // Cambiá si tenés otro endpoint

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const body = new HttpParams()
      .set('username', email)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(this.apiUrl + "/login", body.toString(), { headers });
  }

  setCurrentUser(user: any) {
    this._currentUser = user;
  }

  getCurrentUser(): any {
    return this._currentUser;
  }

  clearUser() {
    localStorage.removeItem('access_token');
    this._currentUser = null;
  }
}
