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
      salutation: data.salutation,
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

  viewUserProfile(data): Observable<any> {
    return this.http.get(API_URL + '/viewUser?username=' + data.username);
  }

  getBadges(data): Observable<any> {
    return this.http.get(API_URL + '/badges?userId=' + data.id);
  }

  generateShareProfilePic(): Observable<any> {
    return this.http.get(API_URL + '/shareProfile');
  }

  getUserAffiliations(data): Observable<any> {
    return this.http.get(API_URL + '/affiliations?userId=' + data.id);
  }

  viewUserById(data): Observable<any> {
    return this.http.get(API_URL + '/viewUserById?userId=' + data.id);
  }

  getUserProfileFeeds(data): Observable<any> {
    return this.http.get(API_URL + '/profileFeed?userId=' + data.id);
  }

  getAllUsers(): Observable<any> {
    return this.http.get('https://localhost:8080/api/mapping/users');
  }

  getAllInstitutions(): Observable<any> {
    return this.http.get('https://localhost:8080/api/mapping/institutions');
  }

  claimAccount(data):Observable<any> {
    return this.http.post('https://localhost:8080/api/mapping/claim', data, httpOptions);
  }
}
