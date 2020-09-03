import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  updateProfile(data): Observable<any> {
    return this.http.post(API_URL + '/updateProfile', {
      name: data.name,
      email: data.email,
      occupation: data.occupation,
      bio: data.bio,
      country: data.country
    }, httpOptions);
  }
}
