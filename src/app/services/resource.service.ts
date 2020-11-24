import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/resource';
const base_url = 'https://localhost:8080';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private http: HttpClient) { }

  getUserManpower(data): Observable<any> {
    return this.http.get(API_URL + '/user/manpower?userId=' + data.id);
  }

  getUserKnowledge(data): Observable<any> {
    return this.http.get(API_URL + '/user/knowledge?userId=' + data.id);
  }

  getUserItem(data): Observable<any> {
    return this.http.get(API_URL + '/user/item?userId=' + data.id);
  }

  getUserVenue(data): Observable<any> {
    return this.http.get(API_URL + '/user/venue?userId=' + data.id);
  }

  getInstitutionKnowledge(data): Observable<any> {
    return this.http.get(API_URL + '/institution/knowledge?institutionId=' + data.id);
  }

  getInstitutionItem(data): Observable<any> {
    return this.http.get(API_URL + '/institution/item?institutionId=' + data.id);
  }

  getInstitutionVenue(data): Observable<any> {
    return this.http.get(API_URL + '/institution/venue?institutionId=' + data.id);
  }

  createItem(formData): Observable<any> {
    return this.http.post(API_URL + '/createItem', formData);
  }

  updateItem(data): Observable<any> {
    return this.http.post(API_URL + '/updateItem', {
      itemId: data.id,
      title: data.title,
      desc: data.desc,
      country: data.country
    }, httpOptions);
  }

  uploadItemPicture(formData): Observable<any> {
    return this.http.post(API_URL + '/uploadItemPicture', 
      formData);
  }

  deleteItemPicture(formData): Observable<any> {
    return this.http.post(API_URL + '/deleteItemPicture', 
      formData);
  }

  createVenue(formData): Observable<any> {
    return this.http.post(API_URL + '/createVenue', formData);
  }

  updateVenue(data): Observable<any> {
    return this.http.post(API_URL + '/updateVenue', {
      venueId: data.id,
      title: data.title,
      desc: data.desc,
      address: data.address,
      country: data.country
    }, httpOptions);
  }

  uploadVenuePicture(formData): Observable<any> {
    return this.http.post(API_URL + '/uploadVenuePicture', 
      formData);
  }

  deleteVenuePicture(formData): Observable<any> {
    return this.http.post(API_URL + '/deleteVenuePicture', 
      formData);
  }

  createManpower(data): Observable<any> {
    return this.http.post(API_URL + '/createManpower', {
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  updateManpower(data): Observable<any> {
    return this.http.post(API_URL + '/updateManpower', {
      manpowerId: data.id,
      title: data.title,
      desc: data.desc,
      country: data.country
    }, httpOptions);
  }

  createKnowledge(formData): Observable<any> {
    return this.http.post(API_URL + '/createKnowledge', formData);
  }

  updateKnowledge(data): Observable<any> {
    return this.http.post(API_URL + '/updateKnowledge', {
      knowledgeId: data.id,
      title: data.title,
      desc: data.desc,
      knowType: data.knowType,
      link: data.link,
      patentNum: data.patentNum,
      expiry: data.expiry,
      issn: data.issn,
      doi: data.doi,
      issueDate: data.issueDate
    }, httpOptions);
  }

  updateKnowledgeOwner(data): Observable<any> {
    return this.http.post(API_URL + '/updateKnowledgeOwner', {
      knowledgeId: data.id,
      owners: data.owners
    }, httpOptions);
  }

  addKnowledgeOwner(data): Observable<any> {
    return this.http.post(API_URL + '/addKnowledgeOwner', {
      knowledgeId: data.knowledgeId,
      userId: data.userId
    }, httpOptions);
  }

  deleteKnowledgeOwner(data): Observable<any> {
    return this.http.post(API_URL + '/deleteKnowledgeOwner', {
      knowledgeId: data.knowledgeId,
      targetId: data.userId,
      targetType: data.userType
    }, httpOptions);
  }

  uploadKnowledgeAttachment(formData): Observable<any> {
    return this.http.post(API_URL + '/uploadKnowledgeAttachment', 
      formData);
  }

  activateItem(data): Observable<any> {
    return this.http.post(API_URL + '/activate/item', {
      itemId: data.id
    }, httpOptions);
  }

  deactivateItem(data): Observable<any> {
    return this.http.post(API_URL + '/deactivate/item', {
      itemId: data.id
    }, httpOptions);
  }

  activateManpower(data): Observable<any> {
    return this.http.post(API_URL + '/activate/manpower', {
      manpowerId: data.id
    }, httpOptions);
  }

  deactivateManpower(data): Observable<any> {
    return this.http.post(API_URL + '/deactivate/manpower', {
      manpowerId: data.id
    }, httpOptions);
  }

  activateKnowledge(data): Observable<any> {
    return this.http.post(API_URL + '/activate/knowledge', {
      knowledgeId: data.id
    }, httpOptions);
  }

  deactivateKnowledge(data): Observable<any> {
    return this.http.post(API_URL + '/deactivate/knowledge', {
      knowledgeId: data.id
    }, httpOptions);
  }

  activateVenue(data): Observable<any> {
    return this.http.post(API_URL + '/activate/venue', {
      venueId: data.id
    }, httpOptions);
  }

  deactivateVenue(data): Observable<any> {
    return this.http.post(API_URL + '/deactivate/venue', {
      venueId: data.id
    }, httpOptions);
  }

  deleteItem(data): Observable<any> {
    return this.http.post(API_URL + '/delete/item', {
      itemId: data.id
    }, httpOptions);
  }

  deleteManpower(data): Observable<any> {
    return this.http.post(API_URL + '/delete/manpower', {
      manpowerId: data.id
    }, httpOptions);
  }

  deleteKnowledge(data): Observable<any> {
    return this.http.post(API_URL + '/delete/knowledge', {
      knowledgeId: data.id
    }, httpOptions);
  }

  deleteVenue(data): Observable<any> {
    return this.http.post(API_URL + '/delete/venue', {
      venueId: data.id
    }, httpOptions);
  }

  getUserPrivateManpower(): Observable<any> {
    return this.http.get(API_URL + '/private/user/manpower');
  }

  getUserPrivateKnowledge(): Observable<any> {
    return this.http.get(API_URL + '/private/user/knowledge');
  }

  getUserPrivateItem(): Observable<any> {
    return this.http.get(API_URL + '/private/user/item');
  }

  getUserPrivateVenue(): Observable<any> {
    return this.http.get(API_URL + '/private/user/venue');
  }

  getInstitutionPrivateKnowledge(): Observable<any> {
    return this.http.get(API_URL + '/private/institution/knowledge');
  }

  getInstitutionPrivateItem(): Observable<any> {
    return this.http.get(API_URL + '/private/institution/item');
  }

  getInstitutionPrivateVenue(): Observable<any> {
    return this.http.get(API_URL + '/private/institution/venue');
  }

  viewItemDetails(data): Observable<any> {
    return this.http.get(API_URL + '/item/details?itemId=' + data.id);
  }

  viewKnowledgeDetails(data): Observable<any> {
    return this.http.get(API_URL + '/knowledge/details?knowledgeId=' + data.id);
  }

  viewManpowerDetails(data): Observable<any> {
    return this.http.get(API_URL + '/manpower/details?manpowerId=' + data.id);
  }

  viewVenueDetails(data): Observable<any> {
    return this.http.get(API_URL + '/venue/details?venueId=' + data.id);
  }

  getAttachmentFile(filePath): Observable<any> {
    return this.http.get(base_url+filePath, {responseType: 'blob'});
  }

  getUserPaid(): Observable<any> {
    return this.http.get('https://localhost:8080/api/paidresource/all/my');
  }

  updatePaidStatus(data): Observable<any> {
    return this.http.post('https://localhost:8080/api/paidresource/status', {
      paidResourceId: data.id,
      status: data.status
    }, httpOptions);
  }
  
  getOthersPaid(data): Observable<any> {
    return this.http.get('https://localhost:8080/api/paidresource/all/others?accountId='+ data.id + '&accountType=' + data.type);
  }
}
