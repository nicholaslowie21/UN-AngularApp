import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/marketplace';
const base_url = 'https://localhost:8080';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getOngoingProjects(): Observable<any> {
    return this.http.get(API_URL + '/projects');
  }

  createProjectRequest(data): Observable<any> {
    return this.http.post(API_URL + '/requestProject', {
      needId:data.needId,
      resourceId:data.resourceId,
      resType:data.resType,
      desc:data.desc
    }, httpOptions)
  }

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

  getItemOffers(): Observable<any> {
    return this.http.get(API_URL + '/resources/item');
  }

  getManpowerOffers(): Observable<any> {
    return this.http.get(API_URL + '/resources/manpower');
  }

  getVenueOffers(): Observable<any> {
    return this.http.get(API_URL + '/resources/venue');
  }

  getKnowledgeOffers(): Observable<any> {
    return this.http.get(API_URL + '/resources/knowledge');
  }

  requestResource(data): Observable<any> {
    return this.http.post(API_URL + '/requestResource', {
      needId: data.needId,
      resourceId: data.resourceId,
      resType: data.resType,
      desc: data.desc
    }, httpOptions);
  }

  useKnowledgeResource(data): Observable<any> {
    return this.http.post(API_URL + '/useKnowledgeResource', {
      resourceId: data.resourceId,
      needId: data.needId,
      desc: data.desc
    }, httpOptions);
  }

  getUserProjects(data): Observable<any> {
    return this.http.get(API_URL + '/accProjects?accountId=' + data.id + '&accountType=' + data.accountType);
  }

}
