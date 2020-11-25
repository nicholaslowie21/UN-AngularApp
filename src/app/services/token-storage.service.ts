import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const ACCTYPE_KEY = 'auth-acctype';
const IS_CHAT_OPEN = 'chat';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  logOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public saveAccountType(type): void {
    window.sessionStorage.removeItem(ACCTYPE_KEY);
    window.sessionStorage.setItem(ACCTYPE_KEY, JSON.stringify(type));
  }

  public getAccountType(): any {
    return JSON.parse(sessionStorage.getItem(ACCTYPE_KEY));
  }

  public setChatStatus(state): any {
    window.sessionStorage.removeItem(IS_CHAT_OPEN);
    window.sessionStorage.setItem(IS_CHAT_OPEN, JSON.stringify(state));
  }

  public getChatStatus(): any {
    return JSON.parse(sessionStorage.getItem(IS_CHAT_OPEN));
  }
}
