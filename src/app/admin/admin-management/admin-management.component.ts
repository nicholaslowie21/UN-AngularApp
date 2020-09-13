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

  content: any;

  constructor(private adminService: AdminService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.adminService.getAdmins().subscribe(
      response => {
        this.admins = response.data.admins;
      }
    )
    this.adminService.getAdminLeads().subscribe(
      response => {
        this.adminLeads = response.data.adminLeads;
      }
    )
    this.adminService.getRegionalAdmins().subscribe(
      response => {
        this.regionalAdmins = response.data.regionalAdmins;
      }
    )
  }

  showAdminLeads(): void {
    this.content = this.adminLeads;
  }

}
