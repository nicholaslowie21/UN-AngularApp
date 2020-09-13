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

  constructor(private adminService: AdminService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    console.log("ADMIN MANAGEMENT");
    this.admins = this.adminService.getAdmins();
    this.regionalAdmins = this.adminService.getRegionalAdmins();
    this.adminLeads = this.adminService.getAdminLeads();
  }

}
