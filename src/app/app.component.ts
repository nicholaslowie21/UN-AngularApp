import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private role: string;
  isLoggedIn = false;
  username: string;
  userType: any;
  showAdmin = false;
  showNavBar = true;

  constructor(private tokenStorageService: TokenStorageService, private route: ActivatedRoute, private router: Router) { 
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    console.log(this.tokenStorageService.getToken())

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      if(this.tokenStorageService.getAccountType() == 'user') {
        this.userType = 'individual';
      } else {
        this.userType = 'institution';
      }
      this.role = user.role;
      console.log(this.role);
      if(this.role == 'admin') {
        this.showAdmin = true;
      } else if(this.role == 'regionaladmin') {
        this.showAdmin = true;
      } else if(this.role == 'adminlead') {
        this.showAdmin = true;
      }

      this.username = user.username;
    }
  }

  onActivate(event: any): void {
    if (event.isShareProfile) {
      this.showNavBar = false;
    }
  }

  logout(): void {
    this.tokenStorageService.logOut();
    window.location.reload();
  }
}
