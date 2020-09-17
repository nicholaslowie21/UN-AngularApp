import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { InstitutionService } from '../../services/institution.service';
import { JsonpClientBackend } from '@angular/common/http';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-user-management-profile',
  templateUrl: './admin-user-management-profile.component.html',
  styleUrls: ['./admin-user-management-profile.component.css']
})
export class AdminUserManagementProfileComponent implements OnInit {

  username: string;
  userType: string;
  user: any;
  userList: any;
  errMsg: "";

  checkUser: any;
  userId: any;

  constructor(private route: ActivatedRoute, private userService: UserService, 
    private institutionService: InstitutionService,  private adminService: AdminService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.username = params.username;
        this.userType = params.userType;
      },
        response => { console.log(JSON.stringify(response)) }
      );
    console.log(this.username);
    console.log(this.userType);

    if (this.userType == 'individual') {
      this.loadUser();
    } else {
      this.loadInstitution();
    }
  }

  loadUser(): void {
    this.userService.viewUserProfile({ username: this.username }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.user = response.data.targetUser;
      },
      err => {
        alert(err.error.message);
      }
    );
  }

  loadInstitution(): void {
    this.institutionService.viewInstitutionProfile({ username: this.username }).subscribe(
      response => {
        this.user = response.data.targetInstitution;
      },
      err => {
        alert(err.error.message);
      }
    )
  }

  activateUser(): void {
    console.log(this.user.id);
    this.adminService.activateUser({ id: this.user.id }).subscribe(
      response => {
        this.loadUser();
        alert("User has been activated!");
      }
    )
  }

  suspendUser(): void {
    console.log(this.user.id);
    this.adminService.suspendUser({ id: this.user.id }).subscribe(
      response => {
        this.loadUser();
        alert("User has been suspended!");
      }
    )
  }

  activateInstitution(): void {
    this.adminService.activateInstitution({ id: this.user.id }).subscribe(
      response => {
        this.loadInstitution();
        alert("Institution has been activated!");
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  suspendInstitution(): void {
    this.adminService.suspendInstitution({ id: this.user.id }).subscribe(
      response => {
        this.loadInstitution();
        alert("Institution has been suspended!");
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

}
