import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

  announcements = [];
  viewForm: any = {};

  sortField: string;
  sortOrder: number;
  sortKeyDate = '';
  sortOptions = [];

  constructor(private communicationService: CommunicationService) { }

  async ngOnInit() {
    await this.communicationService.getAnnouncements().toPromise().then(
      res => this.announcements = res.data.announcements
    );

    this.sortOptions = [
      {label: 'Date Newest to Oldest', value: '!updatedAt'},
      {label: 'Date Oldest to Newest', value: 'updatedAt'}
    ];
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  onSortDate(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
    }
  }

  getAnnouncement(a): void {
    this.viewForm = {
      title: a.title,
      desc: a.desc
    }
  }

}
