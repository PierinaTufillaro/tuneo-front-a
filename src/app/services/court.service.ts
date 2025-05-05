import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Court } from '../interfaces/court.model';

@Injectable({
  providedIn: 'root'
})
export class CourtService {
  private apiUrl = 'http://localhost:8000/courts'; // Cambiá si tenés otro endpoint

  constructor(private http: HttpClient) {}

  createCourt(court: Court): Observable<any> {

    return this.http.post(this.apiUrl, court);
  }

  updateCourt(courtId: number, data: any) {
    return this.http.put(`${this.apiUrl}/${courtId}`, data);
  }

  getCourt(courtId: number): Observable<Court> {
    return this.http.get<Court>(`${this.apiUrl}/${courtId}`);
  }
}
