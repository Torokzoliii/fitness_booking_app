import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Booking } from "../model/Booking";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllBookings() {
    return this.http.get<Booking[]>('http://localhost:8081/app/bookings', {withCredentials: true});
  }

  createBooking(groupId: string) {
    console.log("user: ", this.authService.getUserId());
    console.log("groupId: ", groupId);
    return this.http.post('http://localhost:8081/app/booking?id=' + groupId, {}, { withCredentials: true });
  }

  getMyBookings() {
    return this.http.get<Booking[]>('http://localhost:8081/app/my-bookings', {
      withCredentials: true
    });
  }

  updateBooking(bookingId: string) {
    return this.http.put('http://localhost:8081/app/updateBooking?id=' + bookingId, {}, {
      withCredentials: true
    })
  }

  delete(id: string) {
    return this.http.delete('http://localhost:8081/app/deleteBooking?id=' + id, {withCredentials: true});
  }
}
