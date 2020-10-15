import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/reward';

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
}
