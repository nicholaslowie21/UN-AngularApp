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

  constructor(private adminService: AdminService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.thisUser = this.tokenStorageService.getUser();
  }

  viewUser(username: string): string {
    let usernameFormatted = '';
    for(var i=0; i<username.length; i++) {
      if(username.charAt(i)==' ') {
        usernameFormatted = usernameFormatted.concat('%20');
      } else {
        usernameFormatted = usernameFormatted.concat(username.charAt(i));
      }
    }
    return "http://localhost:4200/admin/user-management/profile?username="+usernameFormatted;
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
        this.searchUsers();
        // console.log(JSON.stringify(response));
      }
    )
    // this.reloadPage();
  }

  suspendUser(y: any): void {
    this.checkUser = y;
    console.log(this.checkUser);
    this.adminService.suspendUser({ id: this.checkUser }).subscribe(
      response => {
        alert("User has been suspended!");
        this.searchUsers();
        // console.log(JSON.stringify(response));
      }
    )
    // this.reloadPage();
  }

  reloadPage(): void {
    window.location.reload();
  }
}
