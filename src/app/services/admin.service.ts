import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/admin';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  searchUser(data): Observable<any> {
    return this.http.get(API_URL + '/searchUsers?username=' + data.username);
  }

  assignRegionalAdmin(data): Observable<any> {
    return this.http.post(API_URL + '/assignRegionalAdmin', {
      targetId: data.id
    }, httpOptions);
  }

  assignUser(data): Observable<any> {
    return this.http.post(API_URL + '/assignUser', {
      targetId: data.id
    }, httpOptions);
  }

  assignAdmin(data): Observable<any> {
    return this.http.post(API_URL + '/assignAdmin', {
      targetId: data.id
    }, httpOptions);
  }

  assignAdminLead(data): Observable<any> {
    return this.http.post(API_URL + '/assignAdminLead', {
      targetId: data.id
    }, httpOptions);
  }

  getRegionalAdmins(): Observable<any> {
    return this.http.get(API_URL + '/regionalAdmins');
  }

  getAdmins(): Observable<any> {
    return this.http.get(API_URL + '/admins');
  }

  getAdminLeads(): Observable<any> {
    return this.http.get(API_URL + '/adminLeads');
  }

  suspendUser(data): Observable<any> {
    return this.http.post(API_URL + '/suspendUser', {
      targetId: data.id
    }, httpOptions);
  }

  activateUser(data): Observable<any> {
    return this.http.post(API_URL + '/activateUser', {
      targetId: data.id
    }, httpOptions);
  }

  suspendProject(data): Observable<any> {
    return this.http.post(API_URL + '/suspendProject', {
      targetId: data.id
    }, httpOptions);
  }

  activateProject(data): Observable<any> {
    return this.http.post(API_URL + '/activateProject', {
      targetId: data.id
    }, httpOptions);
  }
}
