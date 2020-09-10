import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'https://localhost:8080/api/authorization';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + '/login', {
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
      country: user.country,
      gender: user.gender
    }, httpOptions);
  }

  signupInstitution(institution): Observable<any> {
    return this.http.post(AUTH_API + '/institution/signup', {
      name: institution.name,
      username: institution.username,
      email: institution.email,
      password: institution.password,
      country: institution.country
    }, httpOptions);
  }

  changePasswordUser(newPass): Observable<any> {
    return this.http.post(AUTH_API + '/user/changePassword', {
      oldpassword: newPass.oldPassword,
      newpassword: newPass.password
    }, httpOptions);
  }

  changePasswordInstitution(newPass): Observable<any> {
    return this.http.post(AUTH_API + '/institution/changePassword', {
      oldpassword: newPass.oldPassword,
      newpassword: newPass.password
    }, httpOptions);
  }

  forgetPassword(data): Observable<any> {
    return this.http.post(AUTH_API + '/reset-password-request', {
      email: data.email
    }, httpOptions);
  }

  requestVerification(): Observable<any> {
    return this.http.post(AUTH_API + '/user/verifyRequest', {
    }, httpOptions);
  }

  test(): Observable<any> {
    return this.http.post(AUTH_API + 'testing', {
    }, httpOptions);
  }

}
