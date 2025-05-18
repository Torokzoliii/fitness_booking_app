import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get<User[]>('http://localhost:8081/app/getAllUsers', {withCredentials: true});
  }

  getUser(id: string | null) {
    return this.http.get<User>('http://localhost:8081/app/getUser?id=' + id, {withCredentials: true});
  }

  getUserProfile(id: string) {
    return this.http.get<User>('http://localhost:8081/app/getUserProfile?id=' + id, {withCredentials: true});
  }

  updateUserProfile(id: string) {
    // TODO: finish update information
    return this.http.put('http://localhost:8081/app/updateUserProfile?id=' + id, {withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete('http://localhost:8081/app/deleteUser?id=' + id, {withCredentials: true});
  }
}
