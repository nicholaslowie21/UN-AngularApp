import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/report';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  createReport(data): Observable<any> {
    return this.http.post(API_URL, {
      title: data.title,
      summary: data.summary,
      reportType: data.type,
      targetId: data.id
    }, httpOptions);
  }

  getReportByStatus(data): Observable<any> {
    return this.http.get(API_URL + '/filtered/status?status=' + data.status);
  }

  getReportByStatusCountry(data): Observable<any> {
    return this.http.get(API_URL + '/filtered/status?status=' + data.status
      + '&country=' + data.country);
  }

  getMyReports(data): Observable<any> {
    return this.http.get(API_URL + '/my/filtered?status=' + data.status);
  }

  updateReport(data): Observable<any> {
    return this.http.post(API_URL + '/update/status', {
      reportId: data.id,
      status: data.status
    }, httpOptions);
  }
}
