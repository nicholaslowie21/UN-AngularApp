import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/mapping';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  constructor(private http: HttpClient) { }

  uploadUserCSV(formData): Observable<any> {
    return this.http.post(API_URL + '/csv/users',
      formData);
  }

  uploadInstitutionCSV(formData): Observable<any> {
    return this.http.post(API_URL + '/csv/institutions',
      formData);
  }

  claimAccount(formData): Observable<any> {
    return this.http.post(API_URL + '/csv/institutions',
      formData);
  }
}
