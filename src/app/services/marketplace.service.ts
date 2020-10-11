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

  viewProjIncomingProjReq(data): Observable<any> {
    return this.http.get(API_URL + '/project/projectReq?reqStatus='+data.reqStatus+'&projectId='+data.id);
  }

  viewProjOutgoingResReq(data): Observable<any> {
    return this.http.get(API_URL + '/project/resourceReq?reqStatus='+data.reqStatus+'&projectId='+data.id);
  }

  acceptProjectReq(data): Observable<any> {
    return this.http.post(API_URL + '/accept/projectReq', {
      projectReqId: data.id
    }, httpOptions);
  }

  declineProjectReq(data): Observable<any> {
    return this.http.post(API_URL + '/decline/projectReq', {
      projectReqId: data.id
    }, httpOptions);
  }

  cancelProjectReq(data): Observable<any> {
    return this.http.post(API_URL + '/cancel/projectReq', {
      projectReqId: data.id
    }, httpOptions);
  }

  completeProjectReq(data): Observable<any> {
    return this.http.post(API_URL + '/complete/projectReq', {
      projectReqId: data.id
    }, httpOptions);
  }

}
