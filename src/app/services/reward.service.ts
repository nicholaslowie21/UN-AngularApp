import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/reward';
const base_url = 'https://localhost:8080';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  constructor(private http: HttpClient) { }

  createReward(formData): Observable<any> {
    return this.http.post(API_URL + '/offerReward', formData);
  }

  cancelPendingRewardOffer(data): Observable<any> {
    return this.http.post(API_URL + '/cancelReward', {
      rewardId: data.id
    }, httpOptions);
  }

  getRewardOfferings(): Observable<any> {
    return this.http.get(API_URL + '/rewardOfferingList');
  }
  
  getRewardOfferingDetail(data): Observable<any> {
    return this.http.get(API_URL + '/rewardOfferingDetail?rewardId=' + data.id);
  }

  createRewardAdmin(formData): Observable<any> {
    return this.http.post(API_URL + '/createReward', formData);
  }

  getRewardOfferingReq(data): Observable<any> {
    return this.http.get(API_URL + '/allReward?status='+data.status);
  }

  validateReward(data): Observable<any> {
    return this.http.post(API_URL + '/validateReward', {
      rewardId: data.id,
      action: data.action
    }, httpOptions);
  }

  updateReward(formData): Observable<any> {
    return this.http.post(API_URL + '/updateReward', formData);
  }

  deleteReward(data): Observable<any> {
    return this.http.post(API_URL + '/deleteReward', {
      rewardId: data.id
    }, httpOptions);
  }

  getAttachmentFile(filePath): Observable<any> {
    return this.http.get(base_url+filePath, {responseType: 'blob'});
  }

  getRewardMarketplace(): Observable<any> {
    return this.http.get(API_URL + '/marketplace');
  }
}
