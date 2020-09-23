import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/resource';

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

  createItem(data): Observable<any> {
    return this.http.post(API_URL + '/createItem', {
      title: data.title,
      desc: data.desc
    }, httpOptions);
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

  createVenue(data): Observable<any> {
    return this.http.post(API_URL + '/createVenue', {
      title: data.title,
      desc: data.desc,
      address: data.address
    }, httpOptions);
  }

  updateVenue(data): Observable<any> {
    return this.http.post(API_URL + '/updateVenue', {
      venueId: data.venue,
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

  createKnowledge(data): Observable<any> {
    return this.http.post(API_URL + '/createKnowledge', {
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  updateKnowledge(data): Observable<any> {
    return this.http.post(API_URL + '/updateKnowledge', {
      knowledgeId: data.id,
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  updateKnowledgeOwner(data): Observable<any> {
    return this.http.post(API_URL + '/updateKnowledgeOwner', {
      knowledgeId: data.id,
      owners: data.owners
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
}
