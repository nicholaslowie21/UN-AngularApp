import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'https://localhost:8080/api/authorization/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + '/user/login', {
      usernameOrEmail: credentials.usernameOrEmail,
      password: credentials.password
    }, httpOptions);
  }

  signup(user): Observable<any> {
    return this.http.post(AUTH_API + '/user/signup', {
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      country: user.country
    }, httpOptions);
  }

  test(): Observable<any> {
    return this.http.post(AUTH_API + 'testing', {
    }, httpOptions)
  }

}
