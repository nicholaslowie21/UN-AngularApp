import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/marketplace';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  viewFundingProject(): Observable<any> {
    return this.http.get(API_URL + '/fundingNeeds');
  }

  contributeMoney(data): Observable<any> {
    return this.http.post(API_URL + '/contributeMoney', {
      needId: data.id,
      desc: data.desc,
      moneySum: data.moneySum
    }, httpOptions);
  }
}
