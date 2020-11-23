import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from './services/communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private role: string;
  isLoggedIn = false;
  user: any;
  username: string;
  userType: any;
  showAdmin = false;
  showNavBar = true;

  isNotifOpen = false;
  notifications = [];
  hasNewNotif = false;

  constructor(private tokenStorageService: TokenStorageService, private communicationService: CommunicationService) { 
  }

  async ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    console.log(this.tokenStorageService.getToken())

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.user = user;
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

      await this.communicationService.checkNewNotifications().toPromise().then(
        res => this.hasNewNotif = res.data.gotNew
      );
      console.log(this.hasNewNotif)
    }
  }

  onActivate(event: any): void {
    if (event.isShareProfile) {
      this.showNavBar = false;
    }
  }

  toggleNotif(): void {
    this.isNotifOpen = !this.isNotifOpen;
    if(this.isNotifOpen == true) {
      this.loadNotif();
    }
  }

  loadNotif(): void {
    this.communicationService.getNotifications().toPromise().then(
      res => this.notifications = res.data.notifications
    );
    this.hasNewNotif = false;

    console.log(this.notifications);
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  logout(): void {
    this.tokenStorageService.logOut();
    window.location.reload();
  }
}
