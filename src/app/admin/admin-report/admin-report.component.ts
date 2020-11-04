import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { MessageService } from 'primeng/api';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css'],
  providers: [MessageService]
})
export class AdminReportComponent implements OnInit {

  pending = [];
  progress = [];
  solved = [];
  declined = [];

  viewForm: any = {};
  isAcceptSuccessful = false;
  isDeclineSuccessful = false;
  isSolveSuccessful = false;

  sortField: string;
  sortOrder: number;

  constructor(private reportService: ReportService, private messageService: MessageService, private tokenStorageService: TokenStorageService) { }

  async ngOnInit() {
    let user = this.tokenStorageService.getUser();
    if(user.role == 'regionaladmin') {
      await this.reportService.getReportByStatusCountry({status: 'pending', country: user.country}).toPromise().then(
        res => this.pending = res.data.reports
      );
      await this.reportService.getReportByStatusCountry({status: 'progress', country: user.country}).toPromise().then(
        res => this.progress = res.data.reports
      );
      await this.reportService.getReportByStatusCountry({status: 'solved', country: user.country}).toPromise().then(
        res => this.solved = res.data.reports
      );
      await this.reportService.getReportByStatusCountry({status: 'declined', country: user.country}).toPromise().then(
        res => this.declined = res.data.reports
      );
    } else {
      await this.reportService.getReportByStatus({status: 'pending'}).toPromise().then(
        res => this.pending = res.data.reports
      );
      await this.reportService.getReportByStatus({status: 'progress'}).toPromise().then(
        res => this.progress = res.data.reports
      );
      await this.reportService.getReportByStatus({status: 'solved'}).toPromise().then(
        res => this.solved = res.data.reports
      );
      await this.reportService.getReportByStatus({status: 'declined'}).toPromise().then(
        res => this.declined = res.data.reports
      );

      this.isAcceptSuccessful = false;
      this.isDeclineSuccessful = false;
      this.isSolveSuccessful = false;
    }

    console.log(this.pending)
    console.log(this.progress)
    console.log(this.solved)
    console.log(this.declined)
  }

  getReport(a): void {
    this.viewForm = {
      id: a.id,
      title: a.title,
      summary: a.summary,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      status: a.status
    }
  }

  updateReport(id, status): void {
    this.reportService.updateReport({id: id, status: status}).subscribe(
      response => {
        if(status == 'progress') this.isAcceptSuccessful = true;
        if(status == 'declined') this.isDeclineSuccessful = true;
        if(status == 'solved') this.isSolveSuccessful = true;
      },
      err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    )
  }

  closeModal(): void {
    this.ngOnInit();
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

}
