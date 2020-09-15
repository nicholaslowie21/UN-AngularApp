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
}
