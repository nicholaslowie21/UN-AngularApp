import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/paidresource';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PaidResourceService {

  constructor(private http: HttpClient) { }

  createPaidResource(formData): Observable<any> {
    console.log(formData);
    return this.http.post(API_URL, formData);
  }

  updatePaidResource(data): Observable<any> {
    return this.http.post(API_URL + '/updatePaidResource', {
      paidResourceId: data.id,
      title: data.title,
      desc: data.desc,
      country: data.country,
      category: data.category,
      price: data.price
    }, httpOptions);
  }

  uploadPaidResourcePicture(formData): Observable<any> {
    return this.http.post(API_URL + '/uploadPaidResourcePicture', formData);
  }

  deletePaidResourcePicture(data): Observable<any> {
    return this.http.post(API_URL + '/deletePaidResourcePicture', {
      paidResourceId: data.paidResourceId,
      indexes: data.indexes
    }, httpOptions);
  }

  updatePaidResourceStatus(data): Observable<any> {
    return this.http.post(API_URL + '/status', {
      paidResourceId: data.id,
      status: data.status
    }, httpOptions);
  }

  getPaidResourceDetails(data): Observable<any> {
    return this.http.get(API_URL + '/details?paidResourceId=' + data.id);
  }

  getAllMyPaidResources(): Observable<any> {
    return this.http.get(API_URL + '/all/my');
  }

  getAllOthersPaidResources(data): Observable<any> {
    return this.http.get(API_URL + '/all/others?accountId=' + data.id + '&accountType=' + data.type);
  }

  createPurchaseRequest(data): Observable<any> {
    return this.http.post(API_URL + '/purchase/request', {
      paidResourceId: data.id,
      projectId: data.projectId
    }, httpOptions);
  }

  updateBuyerRequestStatus(data): Observable<any> {
    return this.http.post(API_URL + '/buyer/purchase/status', {
      paidResourceId: data.id,
      status: data.status
    }, httpOptions);
  }

  updateSellerRequestStatus(data): Observable<any> {
    return this.http.post(API_URL + '/seller/purchase/status', {
      paidResourceId: data.id,
      status: data.status
    }, httpOptions);
  }

  getMyPurchases(data): Observable<any> {
    return this.http.get(API_URL + '/my/purchase?status=' + data.status);
  }

  getPaidResIncomingRequest(data): Observable<any> {
    return this.http.get(API_URL + '/seller/requests?status=' + data.status + '&paidResourceId=' + data.id);
  }

  getProjectPurchases(data): Observable<any> {
    return this.http.get(API_URL + '/project/purchase?projectId=' + data.projectId);
  }
}
