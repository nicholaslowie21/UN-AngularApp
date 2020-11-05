import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { InstitutionService } from '../../services/institution.service';
import { JsonpClientBackend } from '@angular/common/http';
import { AdminService } from '../../services/admin.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-admin-user-management-profile',
  templateUrl: './admin-user-management-profile.component.html',
  styleUrls: ['./admin-user-management-profile.component.css']
})
export class AdminUserManagementProfileComponent implements OnInit {

  username: string;
  userType: string;
  projectId: string;
  user: any;
  project: any;
  imgString: any;
  userList: any;
  errMsg: "";

  checkUser: any;
  userId: any;
  auditUser: any;
  isAdminLead = false;
  isUser = false;
  isProject = false;
  isReward = false;
  checkAdmin = false;
  auditType: any;
  disableActivate = false;

  constructor(private route: ActivatedRoute, private userService: UserService,
    private institutionService: InstitutionService, private adminService: AdminService,
    private tokenStorageService: TokenStorageService, private projectService: ProjectService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.username = params.username;
        this.userType = params.userType;
        this.projectId = params.id;
      },
        response => { console.log(JSON.stringify(response)) }
      );
    console.log(this.username);
    console.log(this.userType);
    console.log(this.projectId);

    this.auditUser = this.tokenStorageService.getUser();
    console.log(this.auditUser);
    if (this.auditUser.role == 'adminlead') {
      this.isAdminLead = true;
    }

    if (this.userType == 'individual') {
      //this.loadUser();
      await this.userService.viewUserProfile({ username: this.username }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.user = response.data.targetUser;
        },
        err => {
          alert(err.error.message);
        }
      );
      this.isUser = true;
      if(this.user.role == 'admin') {
        this.checkAdmin = true;
        console.log(this.checkAdmin);
      }
    } else if (this.userType == 'institution') {
      //this.loadInstitution();
      await this.institutionService.viewInstitutionProfile({ username: this.username }).toPromise().then(
        response => {
          this.user = response.data.targetInstitution;
        },
        err => {
          alert(err.error.message);
        }
      );
      this.isUser = true;
    }
    if (this.userType == null) {
      //console.log("55: true");
      this.isProject = true;
      await this.projectService.viewProject({ id: this.projectId }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.project = response.data.targetProject;
          this.imgString = "https://localhost:8080" + this.project.imgPath;
        },
        err => {
          alert(err.error.msg);
        }
      );
      if(this.project.status == 'closed') {
        this.disableActivate = true;
      } else if(this.project.status == 'completed') {
        this.disableActivate = true;
      }
    }

  }

  /**loadUser(): void {
    this.userService.viewUserProfile({ username: this.username }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.user = response.data.targetUser;
      },
      err => {
        alert(err.error.message);
      }
    );
  } **/

  /**loadInstitution(): void {
    this.institutionService.viewInstitutionProfile({ username: this.username }).subscribe(
      response => {
        this.user = response.data.targetInstitution;
      },
      err => {
        alert(err.error.message);
      }
    )
  } **/

  viewUser(user): string {
    let usernameFormatted = '';
    for (var i = 0; i < user.username.length; i++) {
      if (user.username.charAt(i) == ' ') {
        usernameFormatted = usernameFormatted.concat('%20');
      } else {
        usernameFormatted = usernameFormatted.concat(user.username.charAt(i));
      }
    }

    let userType = '';
    if (user.role) {
      userType = 'individual';
    } else {
      userType = 'institution';
    }
    return "http://localhost:4200/profile?username=" + usernameFormatted + '&userType=' + userType;

  }

  activateUser(): void {
    console.log(this.user.id);
    this.adminService.activateUser({ id: this.user.id }).subscribe(
      response => {
        //this.loadUser();
        alert("User has been activated!");
        this.ngOnInit();
      }
    )
  }

  suspendUser(): void {
    console.log(this.user.id);
    this.adminService.suspendUser({ id: this.user.id }).subscribe(
      response => {
        //this.loadUser();
        alert("User has been suspended!");
        this.ngOnInit();
      }
    )
  }

  activateInstitution(): void {
    this.adminService.activateInstitution({ id: this.user.id }).subscribe(
      response => {
        //this.loadInstitution();
        alert("Institution has been activated!");
        this.ngOnInit();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  suspendInstitution(): void {
    this.adminService.suspendInstitution({ id: this.user.id }).subscribe(
      response => {
        //this.loadInstitution();
        alert("Institution has been suspended!");
        this.ngOnInit();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  activateProject(): void {
    this.adminService.activateProject({ id: this.projectId }).subscribe(
      response => {
        alert("Project has been activated!");
        this.ngOnInit();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  suspendProject(): void {
    this.adminService.suspendProject({ id: this.projectId }).subscribe(
      response => {
        alert("Project has been suspended!");
        this.ngOnInit();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

}
