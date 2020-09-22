import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/resource';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private http: HttpClient) { }

  getUserManpower(data): Observable<any> {
    return this.http.get(API_URL + '/user/manpower?userId=' + data.id);
  }

  getUserKnowledge(data): Observable<any> {
    return this.http.get(API_URL + '/user/knowledge?userId=' + data.id);
  }

  getUserItem(data): Observable<any> {
    return this.http.get(API_URL + '/user/item?userId=' + data.id);
  }

  getUserVenue(data): Observable<any> {
    return this.http.get(API_URL + '/user/venue?userId=' + data.id);
  }

  getInstitutionKnowledge(data): Observable<any> {
    return this.http.get(API_URL + '/institution/knowledge?institutionId=' + data.id);
  }

  getInstitutionItem(data): Observable<any> {
    return this.http.get(API_URL + '/institution/item?institutionId=' + data.id);
  }

  getInstitutionVenue(data): Observable<any> {
    return this.http.get(API_URL + '/institution/venue?institutionId=' + data.id);
  }

  createItem(data): Observable<any> {
    return this.http.post(API_URL + '/createItem', {
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  createKnowledge(data): Observable<any> {
    return this.http.post(API_URL + '/createKnowledge', {
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  createManpower(data): Observable<any> {
    return this.http.post(API_URL + '/createManpower', {
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  createVenue(data): Observable<any> {
    return this.http.post(API_URL + '/createVenue', {
      title: data.title,
      desc: data.desc,
      address: data.address
    }, httpOptions);
  }
}
