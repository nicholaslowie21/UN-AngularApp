import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/data';
const base_url = 'https://localhost:8080';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<any> {
    return this.http.get(API_URL + '/dashboard');
  }

  getResourceTypes(data): Observable<any> {
    return this.http.get(API_URL + '/resourcesTypesNumbers?year=' + data);
  }

  getContributionTypes(data): Observable<any> {
    return this.http.get(API_URL + '/contributionsTypesNumbers?year=' + data);
  }

  getAccountsChart(data): Observable<any> {
    return this.http.get(API_URL + '/accountCharts?year=' + data);
  }

  getCumulativeProjects(data): Observable<any> {
    return this.http.get(API_URL + '/cumulativeProjects?year=' + data);
  }

  getDatabySDG(data): Observable<any> {
    return this.http.get(API_URL + '/dataBySDGs?startDate=' + data.startDate + '&endDate=' + data.endDate);
  }
}
