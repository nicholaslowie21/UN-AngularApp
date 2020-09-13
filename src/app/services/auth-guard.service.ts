import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private router: Router, private tokenStorage: TokenStorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isLoggedIn = false;
    if (this.tokenStorage.getToken()) {
      isLoggedIn = true;
    }

    if(isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/landing']);
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let role = '';
    if (this.tokenStorage.getToken()) {
      role = this.tokenStorage.getUser().role;
    }

    if(role == "admin" || role == "regionaladmin" || role == "adminlead") {
      return true;
    } else {
      this.router.navigate(['/admin']);
      return false;
    } 
  }
}
