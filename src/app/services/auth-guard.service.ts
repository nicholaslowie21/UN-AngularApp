import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

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
}
