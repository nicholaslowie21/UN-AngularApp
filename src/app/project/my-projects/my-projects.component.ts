import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ProjectService } from '../../services/project.service';


@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  user: any;
  isVerified = false;
  userId: any;
  currProj: any;
  pastProj: any;

  projId: any;
  role: any;

  constructor(private tokenStorageService: TokenStorageService, private userService: UserService, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    this.userId = this.user.id;
    if(this.user.isVerified == "true") {
      this.isVerified = true;
    }
    this.userService.getCurrentProjects({ id: this.userId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.currProj = response.data.currProjects;
        console.log(JSON.stringify(this.currProj));
      }
    );

    this.userService.getPastProjects({ id: this.userId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.pastProj = response.data.pastProjects;
        console.log(JSON.stringify(this.pastProj));
      }
    );

  }

}
