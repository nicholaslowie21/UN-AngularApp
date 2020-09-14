import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {

  admins: any;
  regionalAdmins: any;
  adminLeads: any;

  keyword = '';
  searchResults: any;
  isSearchSuccessful: any;
  errorMsgSearch = '';

  constructor(private adminService: AdminService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.loadAdmins();
    this.loadAdminLeads();
    this.loadRegionalAdmins();
  }

  searchUsers(): void {
    if(this.keyword.length == 0) {
      this.errorMsgSearch = 'Enter a username';
      return;
    }
    this.adminService.searchUser({username: this.keyword}).subscribe(
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

  assignAdminLead(userId): void {
    this.adminService.assignAdminLead({id: userId}).subscribe(
      response => {
        alert("User promoted to admin lead!");
        this.loadAdmins();
        this.loadAdminLeads();
        this.loadRegionalAdmins();
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
