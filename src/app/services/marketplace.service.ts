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

  requestResourceAuto(data): Observable<any> {
    return this.http.post(API_URL + '/auto/requestResource', {
      resourceId: data.resourceId,
      projectId: data.projectId,
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

  useKnowledgeResourceAuto(data): Observable<any> {
    return this.http.post(API_URL + '/auto/useKnowledgeResource', {
      resourceId: data.resourceId,
      projectId: data.projectId,
      desc: data.desc
    }, httpOptions);
  }

  getUserProjects(data): Observable<any> {
    return this.http.get(API_URL + '/accProjects?accountId=' + data.id + '&accountType=' + data.accountType);
  }

  viewMyResOutgoingProjReq(data): Observable<any> {
    return this.http.get(API_URL + '/myConsolidatedProjectReq?reqStatus='+ data.reqStatus);
  }

  viewResOutgoingProjReq(data): Observable<any> {
    return this.http.get(API_URL + '/resource/detail/projectReq?reqStatus='+data.reqStatus+'&resourceId='+data.id);
  }

  viewResIncomingResReq(data): Observable<any> {
    return this.http.get(API_URL + '/resource/detail/resourceReq?reqStatus='+data.reqStatus+'&resourceId='+data.id+'&resType='+data.resType);
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
      projectReqId: data.id,
      theRating: data.rating
    }, httpOptions);
  }

  acceptResourceReq(data): Observable<any> {
    return this.http.post(API_URL + '/accept/resourceReq', {
      resourceReqId: data.id
    }, httpOptions);
  }

  declineResourceReq(data): Observable<any> {
    return this.http.post(API_URL + '/decline/resourceReq', {
      resourceReqId: data.id
    }, httpOptions);
  }

  cancelResourceReq(data): Observable<any> {
    return this.http.post(API_URL + '/cancel/resourceReq', {
      resourceReqId: data.id
    }, httpOptions);
  }

  completeResourceReq(data): Observable<any> {
    return this.http.post(API_URL + '/complete/resourceReq', {
      resourceReqId: data.id,
      theRating: data.rating
    }, httpOptions);
  }

  getResourceSuggestion(data): Observable<any> {
    return this.http.get(API_URL + '/suggestion/resource?needId=' + data.id);
  }

  getResourceNeedSuggestion(data): Observable<any> {
    return this.http.get(API_URL + '/suggestion/resourceneed?resourceId=' + data.id + '&resourceType='+ data.type);
  }
  

  getDiscoverWeekly(): Observable<any> {
    return this.http.get(API_URL + '/discoverWeekly');
    
  }

  getPaidOffers(): Observable<any> {
    return this.http.get(API_URL + '/paidresources');
  }

}
