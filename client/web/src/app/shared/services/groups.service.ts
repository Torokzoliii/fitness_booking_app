import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Groups } from "../model/Groups";

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient) { }

  getAllGroups() {
    return this.http.get<Groups[]>('http://localhost:8081/app/groups', {withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete('http://localhost:8081/app/deleteGroup?id=' + id, {withCredentials: true});
  }
}
