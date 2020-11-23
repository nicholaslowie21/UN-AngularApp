import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { InstitutionService } from '../../services/institution.service';
import { JsonpClientBackend } from '@angular/common/http';
import { AdminService } from '../../services/admin.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ProjectService } from '../../services/project.service';
import { RewardService } from '../../services/reward.service';

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
  reward: any;
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

  userAudit = [];
  adminAudit = [];
  userAuditFile: any;
  adminAuditFile: any;
  id: any;
  isNullUser = false;
  isNullProj = false;
  isNullReward = false;

  constructor(private route: ActivatedRoute, private userService: UserService,
    private institutionService: InstitutionService, private adminService: AdminService,
    private tokenStorageService: TokenStorageService, private projectService: ProjectService,
    private rewardService: RewardService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.username = params.username;
        this.userType = params.type;
        this.id = params.id;
      },
        response => { console.log(JSON.stringify(response)) }
      );
    console.log(this.username);
    console.log(this.userType);
    console.log(this.id);

    this.auditUser = this.tokenStorageService.getUser();
    console.log(this.auditUser);
    if (this.auditUser.role == 'adminlead') {
      this.isAdminLead = true;
    }

    //for individuals and institutions
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
      
      if (this.user.role == 'admin' || this.user.role == 'regionaladmin') {
        this.checkAdmin = true;  

        await this.adminService.getAuditLogs({ id: this.id, type: 'admin' }).toPromise().then(
          response => {
            console.log(JSON.stringify(response));
            this.adminAudit = response.data.logs;
          },
          err => {
            alert(err.error.message);
          }
        );

        await this.adminService.exportAuditLogs({ id: this.id, type: 'admin' }).toPromise().then(
          response => {
            console.log(JSON.stringify(response));
            this.adminAuditFile = response.data.thePath;
          },
          err => {
            alert(err.error.message);
          }
        );
        console.log(this.checkAdmin);
      } else {
        //not any admins, set true
        this.isNullUser = true;
        this.auditType = null;
      }

      await this.adminService.getAuditLogs({ id: this.id, type: 'user' }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.userAudit = response.data.logs;
        },
        err => {
          alert(err.error.message);
        }
      );

      await this.adminService.exportAuditLogs({ id: this.id, type: 'user' }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.userAuditFile = response.data.thePath;
        },
        err => {
          alert(err.error.message);
        }
      );

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
      this.isNullUser = true;
      this.auditType = null;

      await this.adminService.getAuditLogs({ id: this.id, type: 'institution' }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.userAudit = response.data.logs;
        },
        err => {
          alert(err.error.message);
        }
      );

      await this.adminService.exportAuditLogs({ id: this.id, type: 'institution' }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.userAuditFile = response.data.thePath;
        },
        err => {
          alert(err.error.message);
        }
      );
    }

    //for project and rewards
    if (this.userType == 'project') {
      //console.log("98: true");
      this.isProject = true;
      await this.projectService.viewProject({ id: this.id }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.project = response.data.targetProject;
          this.imgString = "https://localhost:8080" + this.project.imgPath;
        },
        err => {
          alert(err.error.msg);
        }
      );
      if (this.project.status == 'closed') {
        this.disableActivate = true;
      } else if (this.project.status == 'completed') {
        this.disableActivate = true;
      }

      this.auditType = null;
      this.isNullProj = true;

      await this.adminService.getAuditLogs({ id: this.id, type: 'project' }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.userAudit = response.data.logs;
        },
        err => {
          alert(err.error.message);
        }
      );

      await this.adminService.exportAuditLogs({ id: this.id, type: 'project' }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.userAuditFile = response.data.thePath;
        },
        err => {
          alert(err.error.message);
        }
      );
    }

    if (this.userType == 'reward') {
      //console.log("reward type");
      this.isReward = true;
      await this.rewardService.getRewardOfferingDetail({ id: this.id}).toPromise().then(
        response => {
          this.reward = response.data.reward;
          this.imgString = "https://localhost:8080" + this.reward.imgPath;
          console.log(JSON.stringify(response));
        },
        err => {
          alert(err.error.message);
        }
      );

      this.auditType = null;
      this.isNullReward = true;

      await this.adminService.getAuditLogs({ id: this.id, type: 'reward' }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.userAudit = response.data.logs;
        },
        err => {
          alert(err.error.message);
        }
      );

      await this.adminService.exportAuditLogs({ id: this.id, type: 'reward' }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.userAuditFile = response.data.thePath;
        },
        err => {
          alert(err.error.message);
        }
      );
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
    this.adminService.activateProject({ id: this.id }).subscribe(
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
    this.adminService.suspendProject({ id: this.id }).subscribe(
      response => {
        alert("Project has been suspended!");
        this.ngOnInit();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  formatDate(date): any {
    let formattedDate = new Date(date);
    return formattedDate.toLocaleString();
  }

}
