import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { ProjectService } from '../services/project.service';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: any;
  userType: any;
  
  newsFeed = [];
  announcements = [];
  viewAnn:any = {};

  constructor(private tokenStorageService: TokenStorageService, private projectService: ProjectService, private communicationService: CommunicationService) { }

  async ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    if(this.tokenStorageService.getAccountType() == 'user') {
      this.userType = 'individual';
    } else {
      this.userType = 'institution';
    }

    await this.projectService.getNewsFeed().toPromise().then(
      res => this.newsFeed = res.data.newsfeeds
    );

    await this.communicationService.getAnnouncements().toPromise().then(
      res => this.announcements = res.data.announcements
    );

    console.log(this.newsFeed);
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  getAnnouncement(a): void {
    this.viewAnn = {
      title: a.title,
      desc: a.desc
    };
  }

}
