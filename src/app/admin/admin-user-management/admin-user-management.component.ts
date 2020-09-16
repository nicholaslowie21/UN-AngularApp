import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent implements OnInit {

  thisUser: any;

  admins: any;
  regionalAdmins: any;
  adminLeads: any;

  keyword = '';
  searchResults: any;
  isSearchSuccessful: any;
  errorMsgSearch = '';

  checkUser: any;
  user: any;
  shareLink = '';
  usernameFormatted = '';

  constructor(private adminService: AdminService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.thisUser = this.tokenStorageService.getUser();

    /**for(var i=0; i<this.user.username.length; i++) {
      if(this.user.username.charAt(i)==' ') {
        this.usernameFormatted = this.usernameFormatted.concat('%20');
      } else {
        this.usernameFormatted = this.usernameFormatted.concat(this.user.username.charAt(i));
      }
    }
    this.shareLink = "http://localhost:4200/profile?username="+this.usernameFormatted; **/
  }

  viewUser(username: string): void {
    for (var i = 0; i < username.length; i++) {
      if (username.charAt(i) == ' ') {
        this.usernameFormatted = this.usernameFormatted.concat('%20');
      } else {
        this.usernameFormatted = this.usernameFormatted.concat(username.charAt(i));
      }
    }
    console.log(this.usernameFormatted);
    this.shareLink = "http://localhost:4200/profile?username=" + this.usernameFormatted;
    console.log(this.shareLink);
  }

  searchUsers(): void {
    if (this.keyword.length == 0) {
      this.errorMsgSearch = 'Enter a username';
      return;
    }
    this.adminService.searchUser({ username: this.keyword }).subscribe(
      response => {
        this.searchResults = response.data.users;
        this.isSearchSuccessful = true;
      },
      err => {
        this.errorMsgSearch = err.error.msg;
        this.isSearchSuccessful = false;
      }
    )
  }

  activateUser(x: any): void {
    this.checkUser = x;
    console.log(this.checkUser);
    this.adminService.activateUser({ id: this.checkUser }).subscribe(
      response => {
        alert("User has been activated!");
        console.log(JSON.stringify(response));
      }
    )
    this.reloadPage();
  }

  suspendUser(y: any): void {
    this.checkUser = y;
    console.log(this.checkUser);
    this.adminService.suspendUser({ id: this.checkUser }).subscribe(
      response => {
        alert("User has been suspended!");
        console.log(JSON.stringify(response));
      }
    )
    this.reloadPage();
  }

  reloadPage(): void {
    window.location.reload();
  }
}
