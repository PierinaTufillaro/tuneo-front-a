import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Complex } from '../interfaces/complex.model';


@Injectable({
  providedIn: 'root'
})
export class ComplexService {
  private apiUrl = 'http://localhost:8000/complexes'; // Cambiá si tenés otro endpoint

  constructor(private http: HttpClient) {}

  createComplex(complex: Complex): Observable<any> {

    return this.http.post(this.apiUrl, complex);
  }

  updateComplex(complexId: number, data: any) {
    return this.http.put(`${this.apiUrl}/${complexId}`, data);
  }

  getMyComplexes(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getCourtsOfComplex(complexId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/${complexId}/courts`, { headers });
  }

}
