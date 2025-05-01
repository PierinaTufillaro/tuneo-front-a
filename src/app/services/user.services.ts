// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // esto asegura que el servicio sea singleton
})
export class UserService {
  private _currentUser: any = null;

  setCurrentUser(user: any) {
    this._currentUser = user;
  }

  getCurrentUser(): any {
    return this._currentUser;
  }

  clearUser() {
    this._currentUser = null;
  }
}
