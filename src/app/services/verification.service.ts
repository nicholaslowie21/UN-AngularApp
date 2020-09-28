import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/verification';
const base_url = 'https://localhost:8080';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private http: HttpClient) { }

  getInstitutionRequests(): Observable<any> {
    return this.http.get(API_URL + '/institutionRequest');
  }

  getUserRequests(): Observable<any> {
    return this.http.get(API_URL + '/userRequest');
  }
  
  verifyInstitution(data): Observable<any> {
    return this.http.post(API_URL + '/verifyInstitution', {
      institutionId: data.id
    }, httpOptions);
  }

  rejectInstitution(data): Observable<any> {
    return this.http.post(API_URL + '/rejectInstitution', {
      institutionId: data.id
    }, httpOptions);
  }

  verifyUser(data): Observable<any> {
    return this.http.post(API_URL + '/acceptUserRequest', {
      requestId: data.id
    }, httpOptions);
  }

  rejectUser(data): Observable<any> {
    return this.http.post(API_URL + '/declineUserRequest', {
      requestId: data.id
    }, httpOptions);
  }

  getRegionalUserRequest(): Observable<any> {
    return this.http.get(API_URL + '/regional/userRequest');
  }

  getRegionalInstitutionRequest(): Observable<any> {
    return this.http.get(API_URL + '/regional/institutionRequest');
  }

  getAttachmentFile(filePath): Observable<any> {
    return this.http.get(base_url+filePath, {responseType: 'blob'});
  }

}
