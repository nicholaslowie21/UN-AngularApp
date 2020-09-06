import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/institution';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  constructor(private http: HttpClient) { }

  updateProfile(data): Observable<any> {
    return this.http.post(API_URL + '/updateProfile', {
      name: data.name,
      address: data.address,
      bio: data.bio,
      country: data.country,
      phone: data.phone
    }, httpOptions);
  }

  updateUsername(data): Observable<any> {
    return this.http.post(API_URL + '/updateUsername', {
      username: data.username
    }, httpOptions);
  }

  updateEmail(data): Observable<any> {
    return this.http.post(API_URL + '/updateEmail', {
      email: data.email
    }, httpOptions);
  }
}
