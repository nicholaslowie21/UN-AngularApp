import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { AdminService } from '../../services/admin.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-report-details',
  templateUrl: './admin-report-details.component.html',
  styleUrls: ['./admin-report-details.component.css'],
  providers: [MessageService]
})
export class AdminReportDetailsComponent implements OnInit {

  id: any;
  report: any;
  reporterId: any;
  reportedId: any;

  constructor(private route: ActivatedRoute, private messageService: MessageService, private reportService: ReportService, 
    private adminService: AdminService) { }

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
          console.log(JSON.stringify(response));
        },
        err => {
          alert(err.error.msg);
        }
      );
  }

  /**activateUser(): void {
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
  }**/
}
