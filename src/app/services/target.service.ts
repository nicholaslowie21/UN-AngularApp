import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/target';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TargetService {

  constructor(private http: HttpClient) { }

  addTargetCSV(formData): Observable<any> {
    return this.http.post('https://localhost:8080/api/dev/csv/target', formData);
  }
  
  getPossibleTargetLists(data): Observable<any> {
    return this.http.post(API_URL + '/possible/targets', {SDGs: data.SDGs}, httpOptions);
  }

  getAccountTargets(data): Observable<any> {
    return this.http.get(API_URL + '/account/targets?accountId=' + data.id + '&accountType=' + data.type);
  }

  updateAccountTargets(data): Observable<any> {
    return this.http.post(API_URL + '/account/targets', {targetIds: data.ids}, httpOptions);
  }

  getProjectTargets(data): Observable<any> {
    return this.http.get(API_URL + '/project/targets?projectId=' + data.id);
  }

  updateProjectTargets(data): Observable<any> {
    return this.http.post(API_URL + '/project/targets', {
      projectId: data.id,
      targetIds: data.targets
    }, httpOptions);
  }
}
