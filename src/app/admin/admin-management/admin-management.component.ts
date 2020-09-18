import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {

  thisUser: any;

  admins: any;
  regionalAdmins: any;
  adminLeads: any;

  keyword = '';
  searchResults: any;
  isSearchSuccessful: any;
  errorMsgSearch = '';

  faSearch = faSearch;

  constructor(private adminService: AdminService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.thisUser = this.tokenStorageService.getUser();
    this.loadAdmins();
    this.loadAdminLeads();
    this.loadRegionalAdmins();
  }

  searchUsers(): void {
    if(this.keyword.length == 0) {
      this.isSearchSuccessful = false;
      this.errorMsgSearch = 'Please enter a username';
      return;
    }
    this.adminService.searchUser({username: this.keyword}).subscribe(
      response => {
        this.searchResults = response.data.users;
        if (this.searchResults.length == 0) {
          this.isSearchSuccessful = false;
          this.errorMsgSearch = 'No users found';
        } else {
          this.isSearchSuccessful = true;
        }
      },
      err => {
        this.errorMsgSearch = err.error.msg;
        this.isSearchSuccessful = false;
      }
    )
  }

  assignAdminLead(userId): void {
    this.adminService.assignAdminLead({id: userId}).subscribe(
      response => {
        alert("User promoted to admin lead!");
        this.loadAdmins();
        this.loadAdminLeads();
        this.loadRegionalAdmins();
        this.searchUsers();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  assignAdmin(userId): void {
    this.adminService.assignAdmin({id: userId}).subscribe(
      response => {
        alert("User promoted to admin!");
        this.loadAdmins();
        this.loadAdminLeads();
        this.loadRegionalAdmins();
        this.searchUsers();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  assignRegionalAdmin(userId): void {
    this.adminService.assignRegionalAdmin({id: userId}).subscribe(
      response => {
        alert("User promoted to regional admin!");
        this.loadAdmins();
        this.loadAdminLeads();
        this.loadRegionalAdmins();
        this.searchUsers();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  assignUser(userId): void {
    this.adminService.assignUser({id: userId}).subscribe(
      response => {
        alert("User demoted to normal user!");
        this.loadAdmins();
        this.loadAdminLeads();
        this.loadRegionalAdmins();
        this.searchUsers();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  loadAdminLeads(): void {
    this.adminService.getAdminLeads().subscribe(
      response => {
        this.adminLeads = response.data.adminLeads;
      }
    )
  }

  loadAdmins(): void {
    this.adminService.getAdmins().subscribe(
      response => {
        this.admins = response.data.admins;
      }
    )
  }

  loadRegionalAdmins(): void {
    this.adminService.getRegionalAdmins().subscribe(
      response => {
        this.regionalAdmins = response.data.regionalAdmins;
      }
    )
  }

  reloadPage(): void {
    window.location.reload();
  }

}
