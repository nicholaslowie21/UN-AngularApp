import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/communication';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor(private http: HttpClient) { }

  createAnnouncement(data): Observable<any> {
    return this.http.post(API_URL + '/createAnnouncement', {
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  editAnnouncement(data): Observable<any> {
    return this.http.post(API_URL + '/editAnnouncement', {
      announcementId: data.id,
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  deleteAnnouncement(data): Observable<any> {
    return this.http.delete(API_URL + '/deleteAnnouncement?announcementId=' + data.id);
  }

  getAnnouncements(): Observable<any> {
    return this.http.get(API_URL + '/announcement');
  }
}
