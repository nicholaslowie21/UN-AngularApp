import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  projectCode: any;
  project: any;
  projectId: any;

  user: any;
  userId: any;
  isCreator = false;
  isAdmin = false;
  isContributor = false;

  projHost: any;
  projAdmins = [];

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private userService: UserService,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        //this.projectCode = params.code;
        this.projectId = params.id;
      }
      );
    //this.loadProject();
    this.projectService.viewProject({ id: this.projectId }).toPromise().then(
      response => {
        this.project = response.data.targetProject;
        this.projHost = response.data.targetProject.host;
        this.projAdmins = response.data.targetProject.admins;
        console.log(this.project);
        console.log(this.projHost);
        //console.log(this.userId);
        console.log(this.projAdmins);
      },
      err => {
        alert(err.error.msg);
      }
    );

    this.user = this.tokenStorageService.getUser();
    this.userId = this.user.id;
    //this.checkRole();

    console.log(this.projHost);
    console.log(this.userId);

  }

  loadProject(): void {
    this.projectService.viewProject({ id: this.projectId }).toPromise().then(
      response => {
        this.project = response.data.targetProject;
        this.projHost = response.data.targetProject.host;
        this.projAdmins = response.data.targetProject.admins;
        console.log(this.project);
        console.log(this.projHost);
        console.log(this.projAdmins);
      },
      err => {
        alert(err.error.msg);
      }
    );

    console.log(this.projHost);
    console.log(this.userId);

    if (String(this.userId) === String(this.projHost)) {
      this.isCreator = true;
      console.log(this.isCreator);
      console.log(this.isAdmin);
    } else {
      let x = this.projAdmins.length;
      for (var y = 0; y < x; y++) {
        console.log(this.projAdmins[y]);
      }
    }
  }

  checkRole(): void {
    //check if user is creator
    if (String(this.userId) === String(this.projHost)) {
      this.isCreator = true;
      console.log(this.isCreator);
      console.log(this.isAdmin);
    } /**else {
      //check if user is admin
      for (var x = 0; x < this.projAdmins.length; x++) {
        console.log(this.projAdmins[x]);
      }
    }**/

    console.log(this.isCreator);
    console.log(this.isAdmin);
  }

}

/**for (var x = 0; x < this.projAdmins.length; x++) {
  if (String(this.userId) == String(this.projAdmins[x])) {
    this.isAdmin = true;
  } else {
    this.isAdmin = false;
  }
} **/