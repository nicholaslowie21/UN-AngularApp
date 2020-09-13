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
      phone: data.phone,
      website: data.website,
      SDGs: data.SDGs
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

  getAffiliatedUsers(): Observable<any> {
    return this.http.get(API_URL + '/getMembers');
  }

  addAffiliatedUsers(data): Observable<any> {
    return this.http.post(API_URL + '/addMember', {
      userId: data.userId
    }, httpOptions);
  }

  deleteAffiliatedUser(data): Observable<any> {
    return this.http.post(API_URL + '/delMember', {
      userId: data.userId
    }, httpOptions);
  }

  getCurrentProjects(): Observable<any> {
    return this.http.get(API_URL + '/currProjects');
  }

  getPastInvolvement(): Observable<any> {
    return this.http.get(API_URL + '/pastProjects');
  }

  uploadAffiliationCSV(formData): Observable<any> {
    return this.http.post(API_URL + '/membersCSV', 
      formData);
  }

  viewInstitutionProfile(data): Observable<any> {
    return this.http.post(API_URL + '/viewInstitution', {
      institutionId: data.id
    }, httpOptions);
  }

  getBadges(): Observable<any> {
    return this.http.get(API_URL + '/badges');
  }
}