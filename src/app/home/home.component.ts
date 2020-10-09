import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: any;
  userType: any;
  
  newsFeed = [];

  constructor(private tokenStorageService: TokenStorageService, private projectService: ProjectService) { }

  async ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    if(this.tokenStorageService.getAccountType() == 'user') {
      this.userType = 'individual';
    } else {
      this.userType = 'institution';
    }

    await this.projectService.getNewsFeed().toPromise().then(
      res => this.newsFeed = res.data.newsfeeds
    )

    console.log(this.newsFeed);
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

}
