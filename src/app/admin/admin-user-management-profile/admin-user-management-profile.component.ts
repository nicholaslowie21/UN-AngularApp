import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { InstitutionService } from '../../services/institution.service';
import { AdminService } from '../../services/admin.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ProjectService } from '../../services/project.service';
import { RewardService } from '../../services/reward.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-user-management-profile',
  templateUrl: './admin-user-management-profile.component.html',
  styleUrls: ['./admin-user-management-profile.component.css'],
  providers: [MessageService]
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

  userAudit = [];
  adminAudit = [];
  userAuditFile: any;
  adminAuditFile: any;
  id: any;
  isNullUser = false;
  isNullProj = false;
  isNullReward = false;

  rangeDates: any;

  constructor(private route: ActivatedRoute, private userService: UserService,
    private institutionService: InstitutionService, private adminService: AdminService,
    private tokenStorageService: TokenStorageService, private projectService: ProjectService,
    private rewardService: RewardService, private messageService: MessageService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.username = params.username;
        this.userType = params.type;
        this.id = params.id;
      }
    );

    this.auditUser = this.tokenStorageService.getUser();
    if (this.auditUser.role == 'adminlead') {
      this.isAdminLead = true;
    }

    await this.generateExportLink();

    //for individuals and institutions
    if (this.userType == 'individual') {
      await this.userService.viewUserById({ id: this.id }).toPromise().then(
        response => {
          this.user = response.data.targetUser;
        },
        err => {
          alert(err.error.message);
        }
      );
      this.isUser = true;
      
      if (this.user.role == 'admin' || this.user.role == 'regionaladmin' || this.user.role == 'adminlead') {
        this.checkAdmin = true;  

        await this.adminService.getAuditLogs({ id: this.id, type: 'admin' }).toPromise().then(
          response => {
            this.adminAudit = response.data.logs;
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
          this.userAudit = response.data.logs;
        },
        err => {
          alert(err.error.message);
        }
      );

    } else if (this.userType == 'institution') {
      await this.institutionService.viewInstitutionById({ id: this.id }).toPromise().then(
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
          this.userAudit = response.data.logs;
        },
        err => {
          alert(err.error.message);
        }
      );
    }

    //for project and rewards
    if (this.userType == 'project') {
      this.isProject = true;
      await this.projectService.viewProject({ id: this.id }).toPromise().then(
        response => {
          this.project = response.data.targetProject;
          this.imgString = "https://localhost:8080" + this.project.imgPath;
        },
        err => {
          alert(err.error.msg);
        }
      );

      this.auditType = null;
      this.isNullProj = true;

      await this.adminService.getAuditLogs({ id: this.id, type: 'project' }).toPromise().then(
        response => {
          this.userAudit = response.data.logs;
        },
        err => {
          alert(err.error.message);
        }
      );
    }

    if (this.userType == 'reward') {
      this.isReward = true;
      await this.rewardService.getRewardOfferingDetail({ id: this.id}).toPromise().then(
        response => {
          this.reward = response.data.reward;
          this.imgString = "https://localhost:8080" + this.reward.imgPath;
        },
        err => {
          alert(err.error.message);
        }
      );

      this.auditType = null;
      this.isNullReward = true;

      await this.adminService.getAuditLogs({ id: this.id, type: 'reward' }).toPromise().then(
        response => {
          this.userAudit = response.data.logs;
        },
        err => {
          alert(err.error.message);
        }
      );
    }
  }

  async generateExportLink() {
    let tempType = this.userType;
    if(this.userType == 'individual') {
      tempType = 'user';
    }
    await this.adminService.exportAuditLogs({ id: this.id, type: tempType }).toPromise().then(
      response => {
        this.userAuditFile = response.data.thePath;
      },
      err => {
        alert(err.error.message);
      }
    );
  }

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
    let r = confirm("Are you sure you want to activate this account?");
    if (r == true) {
      this.adminService.activateUser({ id: this.user.id }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Account activated successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  suspendUser(): void {
    let r = confirm("Are you sure you want to suspend this account?");
    if (r == true) {
      this.adminService.suspendUser({ id: this.user.id }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Account suspended successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  activateInstitution(): void {
    let r = confirm("Are you sure you want to activate this account?");
    if (r == true) {
      this.adminService.activateInstitution({ id: this.user.id }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Account activated successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  suspendInstitution(): void {
    let r = confirm("Are you sure you want to suspend this account?");
    if (r == true) {
      this.adminService.suspendInstitution({ id: this.user.id }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Account suspended successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  activateProject(): void {
    let r = confirm("Are you sure you want to activate this project?");
    if (r == true) {
      this.adminService.activateProject({ id: this.id }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Project activated successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  suspendProject(): void {
    let r = confirm("Are you sure you want to suspend this project?");
    if (r == true) {
      this.adminService.suspendProject({ id: this.id }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Project suspended successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  formatDate(date): any {
    let formattedDate = new Date(date);
    return formattedDate.toLocaleString();
  }

  formatDateNoTime(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  async filterByDateRange() {
    await this.ngOnInit();
    let a = new Date(this.rangeDates[0]);
    let b = new Date(this.rangeDates[1]);
    let arr = [];
    for(var i=0; i<this.userAudit.length; i++) {
      let c = new Date(this.userAudit[i].createdAt);
      if(c >= a && c <= b) {
        arr.push(this.userAudit[i]);
      }
    }
    this.userAudit = arr;
  }

}
