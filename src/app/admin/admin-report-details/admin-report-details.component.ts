import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { AdminService } from '../../services/admin.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-admin-report-details',
  templateUrl: './admin-report-details.component.html',
  styleUrls: ['./admin-report-details.component.css'],
  providers: [MessageService]
})
export class AdminReportDetailsComponent implements OnInit {

  id: any;
  report: any;
  type: any;
  reporterId: any;
  reportedId: any;
  status: any;

  loggedInUser: any;

  constructor(private route: ActivatedRoute, private messageService: MessageService, private reportService: ReportService, 
    private adminService: AdminService, private router: Router, private tokenStorageService: TokenStorageService,
    private communicationService: CommunicationService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.id = params.id;
      }
    );

    this.loggedInUser = this.tokenStorageService.getUser();

      await this.reportService.getReportDetails({ id: this.id }).toPromise().then(
        response => {
          this.report = response.data.report;
          this.type = this.report.reportType;
          this.status = this.report.status;
          console.log(JSON.stringify(response));
        },
        err => {
          alert(err.error.msg);
        }
      );
      console.log(this.type);
  }

  checkAccess() {
    let myRole = this.loggedInUser.role;
    if(this.report.targetRole == 'admin' || this.report.targetRole == 'regionaladmin') {
      if(myRole == 'admin' || myRole == 'regionaladmin')  return false;
      if(myRole == 'adminlead') return true;
    } else if(this.report.targetRole == 'adminlead') {
      if (myRole == 'adminlead' && this.report.targetUsername != this.loggedInUser.username) return true;
      else  return false;
    } else if(this.report.targetRole == 'user')  return true;
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  viewReported(): void {
    if(this.type=='project') {
      this.router.navigate(['/admin/user-management/profile'], {queryParams: {type: this.type, id: this.report.targetId}});
    } else if(this.type=='user') {
      this.router.navigate(['/admin/user-management/profile'], {queryParams: {username: this.report.targetUsername, type: 'individual', id: this.report.targetId}});
    } else {
      this.router.navigate(['/admin/user-management/profile'], {queryParams: {username: this.report.targetUsername, type: this.type, id: this.report.targetId}});
    }
  }

  viewReporter(): void {
    if(this.report.reporterType == 'user') {
      this.router.navigate(['/admin/user-management/profile'], {queryParams: {username: this.report.reporterUsername, type: 'individual', id: this.report.reporterId}});
    } else {
      this.router.navigate(['/admin/user-management/profile'], {queryParams: {username: this.report.reporterUsername, type: this.report.reporterType, id: this.report.reporterId}});
    }
  }

  activateUser(id): void {
    let r = confirm("Are you sure you want to activate this account?");
    if (r == true) {
      this.adminService.activateUser({ id: id }).subscribe(
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

  suspendUser(pid): void {
    let r = confirm("Are you sure you want to suspend this account?");
    if (r == true) {
      this.adminService.suspendUser({ id: pid }).subscribe(
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

  activateInstitution(pid): void {
    let r = confirm("Are you sure you want to activate this account?");
    if (r == true) {
      this.adminService.activateInstitution({ id: pid }).subscribe(
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

  suspendInstitution(pid): void {
    let r = confirm("Are you sure you want to suspend this account?");
    if (r == true) {
      this.adminService.suspendInstitution({ id: pid }).subscribe(
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

  activateProject(pid): void {
    let r = confirm("Are you sure you want to activate this project?");
    if (r == true) {
      this.adminService.activateProject({ id: pid }).subscribe(
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

  suspendProject(pid): void {
    let r = confirm("Are you sure you want to suspend this project?");
    if (r == true) {
      this.adminService.suspendProject({ id: pid }).subscribe(
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

  updateReport(id, status): void {
    let r;
    if(status == 'declined') {
      r = confirm("Are you sure you want to decline this report?");
    } else if (status == 'progress') {
      r = confirm("Are you sure you want to accept this report?");
    } else {
      r = confirm("Are you sure you want to mark this report as solved?");
    }

    if(r == true) {
      this.reportService.updateReport({id: id, status: status}).subscribe(
        response => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Report updated!'});
          this.ngOnInit();
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  chatUser(targetType, id): void {
    if(id == this.loggedInUser.id) {
      this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:'You are the project founder'});
      return;
    }
    const chatForm = {
      chatType: 'admin',
      targetId: id,
      targetType: targetType
    }
    this.communicationService.chatAccount(chatForm).subscribe(
      response => {
        console.log(response)
        let chatStatus = this.tokenStorageService.getChatStatus();
        this.tokenStorageService.setChatStatus({status:"room", id:response.data.chatRoom.id, selectedChatType: chatStatus.selectedChatType });
        window.location.reload();
      }, err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    )
  }
}
