import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { AdminService } from '../../services/admin.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private messageService: MessageService, private reportService: ReportService, 
    private adminService: AdminService, private router: Router) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.id = params.id;
      }
      );
      console.log(this.id);

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
    console.log(id);
    this.adminService.activateUser({ id: id }).subscribe(
      response => {
        //this.loadUser();
        alert("User has been activated!");
        this.ngOnInit();
      }
    )
  }

  suspendUser(pid): void {
    console.log(pid);
    this.adminService.suspendUser({ id: pid }).subscribe(
      response => {
        //this.loadUser();
        alert("User has been suspended!");
        this.ngOnInit();
      }
    )
  }

  activateInstitution(pid): void {
    this.adminService.activateInstitution({ id: pid }).subscribe(
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

  suspendInstitution(pid): void {
    this.adminService.suspendInstitution({ id: pid }).subscribe(
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

  activateProject(pid): void {
    this.adminService.activateProject({ id: pid }).subscribe(
      response => {
        alert("Project has been activated!");
        this.ngOnInit();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  suspendProject(pid): void {
    this.adminService.suspendProject({ id: pid }).subscribe(
      response => {
        alert("Project has been suspended!");
        this.ngOnInit();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  updateReport(id, status): void {
    this.reportService.updateReport({id: id, status: status}).subscribe(
      response => {
        this.messageService.add({key:'toastMsg',severity:'success',summary:'Report updated!'});
        this.ngOnInit();
      },
      err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    )
  }
}
