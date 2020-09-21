import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/project';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  viewProject(data): Observable<any> {
    return this.http.get(API_URL + '/viewProject?code=' + data.code);
  }

  searchProject(data): Observable<any> {
    return this.http.get(API_URL + '/searchProjectsCode?code=' + data.code);
  }

  createProject(data): Observable<any> {
    return this.http.post(API_URL + '/createProject', {
      title: data.title,
      desc: data.desc,
      rating: data.rating,
      SDGs: data.SDGs
    }, httpOptions)
  }

  updateProject(data): Observable<any> {
    return this.http.post(API_URL + '/updateProject', {
      projectId: data.id,
      title: data.title,
      desc: data.desc,
      country: data.country,
      rating: data.rating,
      SDGs: data.SDGs
    }, httpOptions)
  }

  deleteProject(data): Observable<any> {
    return this.http.post(API_URL + '/deleteProject', {
      projectId: data.id
    }, httpOptions)
  }

  editAdmin(data): Observable<any> {
    return this.http.post(API_URL + '/editAdmin', {
      projectId: data.id,
      admins: data.adminIDs
    }, httpOptions)
  }
}
