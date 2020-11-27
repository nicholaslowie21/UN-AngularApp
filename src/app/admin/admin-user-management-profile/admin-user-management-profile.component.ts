import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { InstitutionService } from '../../services/institution.service';
import { AdminService } from '../../services/admin.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ProjectService } from '../../services/project.service';
import { RewardService } from '../../services/reward.service';
import { MessageService } from 'primeng/api';
import { elementClosest } from '@fullcalendar/core';

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
        await this.generateExportLink('admin');
        console.log(this.adminAuditFile)
        await this.loadAudit('admin');
      } else {
        //not any admins, set true
        this.isNullUser = true;
        this.auditType = null;
      }
      await this.generateExportLink('user');
      await this.loadAudit('user');

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
      await this.generateExportLink('institution');
      await this.loadAudit('institution');
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
      await this.generateExportLink('project');
      await this.loadAudit('project');
    }

    if (this.userType == 'reward') {
      this.isReward = true;
      await this.rewardService.getRewardDetails({ id: this.id}).toPromise().then(
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
      await this.generateExportLink('reward');
      await this.loadAudit('reward');
    }
  }

  async generateExportLink(type) {
    await this.adminService.exportAuditLogs({ id: this.id, type: type }).toPromise().then(
      response => {
        if(type == 'admin') this.adminAuditFile = response.data.thePath;
        else  this.userAuditFile = response.data.thePath;
      },
      err => {
        alert(err.error.message);
      }
    );
  }

  async loadAudit(type) {
    await this.adminService.getAuditLogs({ id: this.id, type: type }).toPromise().then(
      response => {
        if(type == 'admin') this.adminAudit = response.data.logs;
        else  this.userAudit = response.data.logs;
      },
      err => {
        alert(err.error.message);
      }
    );
  }

  checkAccess() {
    if(!this.checkAdmin) return true;
    if(this.checkAdmin) {
      if(this.isAdminLead && this.user.username != this.auditUser.username)  return true;
      else  return false;
    }
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

  async filterByDateRange(type) {
    await this.loadAudit(type);
    console.log(this.rangeDates)
    let a = new Date(this.rangeDates[0]);
    let b = null;
    if(this.rangeDates[1] != null) {
      b = new Date(this.rangeDates[1]);
    }

    let arr = [];
    let tempArr;
    if(type == 'admin') tempArr = this.adminAudit;
    else  tempArr = this.userAudit;

    for(var i=0; i<tempArr.length; i++) {
      let c = new Date(tempArr[i].createdAt);
      if(b == null) {
        if(c.toDateString() === a.toDateString()) {
          arr.push(tempArr[i]);
        }
      } else {
        if((c > a || c.toDateString() === a.toDateString()) && 
          (c < b || c.toDateString() === b.toDateString())) {
          arr.push(tempArr[i]);
        }
      }
    }

    if(type == 'admin') this.adminAudit = arr;
    else  this.userAudit = arr;
    
  }

}
