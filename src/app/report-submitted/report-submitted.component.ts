import { Component, OnInit } from '@angular/core';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-report-submitted',
  templateUrl: './report-submitted.component.html',
  styleUrls: ['./report-submitted.component.css']
})
export class ReportSubmittedComponent implements OnInit {

  pending = [];
  progress = [];
  solved = [];
  declined = [];

  viewForm: any = {targetImg: ''};

  sortField: string;
  sortOrder: number;

  constructor(private reportService: ReportService) { }

  async ngOnInit() {
    await this.reportService.getMyReports({status: 'pending'}).toPromise().then(
      res => this.pending = res.data.reports
    );
    await this.reportService.getMyReports({status: 'progress'}).toPromise().then(
      res => this.progress = res.data.reports
    );
    await this.reportService.getMyReports({status: 'solved'}).toPromise().then(
      res => this.solved = res.data.reports
    );
    await this.reportService.getMyReports({status: 'declined'}).toPromise().then(
      res => this.declined = res.data.reports
    );
    
    console.log(this.pending)
  }

  getReport(a): void {
    this.viewForm = {
      title: a.title,
      summary: a.summary,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      status: a.status,
      reportType: a.reportType,
      targetUsername: a.targetUsername,
      targetName: a.targetName,
      targetTitle: a.targetTitle,
      targetId: a.targetId,
      targetImg: a.targetImg
    }
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

}
