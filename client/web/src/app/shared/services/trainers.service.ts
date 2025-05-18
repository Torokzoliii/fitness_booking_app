import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Trainers} from "../model/Trainers";

@Injectable({
  providedIn: 'root'
})
export class TrainersService {

  constructor(private http: HttpClient) { }

  getAllTrainers() {
    return this.http.get<Trainers[]>('http://localhost:8081/app/trainers', {withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete('http://localhost:8081/app/deleteTrainer?id=' + id, {withCredentials: true});
  }
}
