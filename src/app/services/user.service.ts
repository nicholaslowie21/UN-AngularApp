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
      occupation: data.occupation,
      bio: data.bio,
      country: data.country,
      website: data.website,
      gender: data.gender,
      SDGs: data.SDGs,
      skills: data.skills
    }, httpOptions);
  }

  uploadProfilePicture(formData): Observable<any> {
    return this.http.post(API_URL + '/uploadProfilePicture',
      formData);
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

  getCurrentProjects(data): Observable<any> {
    return this.http.get(API_URL + '/currProjects?userId=' + data.id);
  }

  getPastProjects(data): Observable<any> {
    return this.http.get(API_URL + '/pastProjects?userId=' + data.id);
  }

  viewProfile(data): Observable<any> {
    return this.http.get(API_URL + '/viewUser?userId=' + data.id);
  }

  getBadges(data): Observable<any> {
    return this.http.get(API_URL + '/badges?userId=' + data.id);
  }
}
