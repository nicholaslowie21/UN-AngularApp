import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/project';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  viewProject(data): Observable<any> {
    return this.http.get(API_URL + '/viewProject?projectId=' + data.id);
  }

  searchProject(data): Observable<any> {
    return this.http.get(API_URL + '/searchProjectsCode?code=' + data.code);
  }

  createProject(data): Observable<any> {
    return this.http.post(API_URL + '/createProject', {
      title: data.title,
      desc: data.desc,
      rating: data.rating,
      SDGs: data.SDGs
    }, httpOptions)
  }

  updateProject(data): Observable<any> {
    return this.http.post(API_URL + '/updateProject', {
      projectId: data.id,
      title: data.title,
      desc: data.desc,
      country: data.country,
      rating: data.rating,
      SDGs: data.SDGs
    }, httpOptions)
  }

  deleteProject(data): Observable<any> {
    return this.http.post(API_URL + '/deleteProject', {
      projectId: data.id
    }, httpOptions)
  }

  addProjectAdmin(data): Observable<any> {
    return this.http.post(API_URL + '/addAdmin', {
      projectId: data.id,
      userId: data.userId
    }, httpOptions)
  }

  deleteProjectAdmin(data): Observable<any> {
    return this.http.post(API_URL + '/deleteAdmin', {
      projectId: data.id,
      userId: data.userId
    }, httpOptions)
  }

  searchUsers(data): Observable<any> {
    return this.http.get(API_URL + '/searchUsers?username=' + data.username);
  }

  getAdmins(data): Observable<any> {
    return this.http.get(API_URL + '/projectAdmins?projectId=' + data.id);
  }

  getProjectHost(data): Observable<any> {
    return this.http.get(API_URL + '/projectHost?projectId=' + data.id);
  }

  uploadProjectPicture(formData): Observable<any> {
    return this.http.post(API_URL + '/uploadProjectPicture', formData);
  }

  createKPI(data): Observable<any> {
    return this.http.post(API_URL + '/createKPI', {
      projectId: data.id,
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  updateKPI(data): Observable<any> {
    return this.http.post(API_URL + '/updateKPI', {
      kpiId: data.id,
      title: data.title,
      desc: data.desc,
      completion: data.completion
    }, httpOptions);
  }

  deleteKPI(data): Observable<any> {
    return this.http.post(API_URL + '/deleteKPI', {
      kpiId: data.id
    }, httpOptions);
  }

  getProjectKPIs(data): Observable<any> {
    return this.http.get(API_URL + '/projectKPI?projectId=' + data.id);
  }

  completeProject(data): Observable<any> {
    return this.http.post(API_URL + '/completeProject', {
      projectId: data.id
    }, httpOptions);
  }

  createResourceNeed(data): Observable<any> {
    return this.http.post(API_URL + '/createResourceNeed', {
      projectId: data.id,
      title: data.title,
      desc: data.desc,
      resourceType: data.resourceType,
      total: data.total
    }, httpOptions);
  }

  editResourceNeed(data): Observable<any> {
    return this.http.post(API_URL + '/editResourceNeed', {
      needId: data.id,
      title: data.title,
      desc: data.desc,
      total: data.total,
      completion: data.completion
    }, httpOptions);
  }

  deleteResourceNeed(data): Observable<any> {
    return this.http.post(API_URL + '/deleteResourceNeed', {
      needId: data.id
    }, httpOptions);
  }

  getProjectResourceNeeds(data): Observable<any> {
    return this.http.get(API_URL + '/resourceNeeds?projectId=' + data.id);
  }

  getProjectContributions(data): Observable<any> {
    return this.http.get(API_URL + '/contributions?projectId=' + data.id);
  }
}
