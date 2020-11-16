import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/testimonial';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {

  constructor(private http: HttpClient) { }

  getCommonProjects(data): Observable<any> {
    return this.http.get(API_URL + '/common/projects?accountId=' + data.id + '&accountType=' + data.type);
  }

  requestTestimonial(data): Observable<any> {
    return this.http.post(API_URL + '/request', {
      accountId: data.id,
      accountType: data.type,
      projectId: data.projectId
    }, httpOptions);
  }

  getMyOutgoingTestimonials(data): Observable<any> {
    return this.http.get(API_URL + '/outgoing?accountId=' + data.id + '&accountType=' + data.type 
      + '&status=' + data.status);
  }

  getMyTestimonial(data): Observable<any> {
    return this.http.get(API_URL + '?accountId=' + data.id + '&accountType=' + data.type 
      + '&status=' + data.status);
  }

  updateMyTestimonialStatus(data): Observable<any> {
    return this.http.post(API_URL + '/update/status', {
      testimonialId: data.id,
      status: data.status
    }, httpOptions);
  }

  updateMyOutgoingTestimonial(data): Observable<any> {
    return this.http.post(API_URL + '/outgoing/update/status', {
      testimonialId: data.id,
      status: data.status,
      desc: data.desc
    }, httpOptions);
  }

  giveTestimonial(data): Observable<any> {
    return this.http.post(API_URL + '/write', {
      accountId: data.accountId,
      accountType: data.accountType,
      projectId: data.projectId,
      desc: data.desc
    })
  }

}
