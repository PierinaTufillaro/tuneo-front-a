import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from '../interfaces/booking.model';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8000/booking-slots';
  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<any> {

    return this.http.post(this.apiUrl, booking);
  }

  updateBooking(bookingId: number, data: any) {
    return this.http.put(`${this.apiUrl}/${bookingId}`, data);
  }

  getBooking(bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${bookingId}`);
  }

  getSlotsByCourt(courtId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/court/${courtId}`);

  }
}
