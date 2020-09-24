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

  isCompleted = false;
  isDeleted = false;
  isOngoing = false;
  status: any;

  projHost: any;
  projAdmins = [];

  form: any = {};
  errorMsg = '';
  KPIs: any;
  updateForm: any = {};

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private userService: UserService,
    private tokenStorageService: TokenStorageService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        //this.projectCode = params.code;
        this.projectId = params.id;
      }
      );
    // this.loadProject();
    await this.projectService.viewProject({ id: this.projectId }).toPromise().then(
      response => {
        this.project = response.data.targetProject;
        this.projHost = response.data.targetProject.host;
        this.projAdmins = response.data.targetProject.admins;
        this.status = response.data.targetProject.status;
        // console.log("INIT: "+this.project);
        console.log("INIT INSIDE SERVICE: "+this.projHost);
        //console.log(this.userId);
        console.log("INIT INSIDE SERVICE: "+this.projAdmins);
        console.log(this.status);
      },
      err => {
        alert(err.error.msg);
      }
    );

    this.user = this.tokenStorageService.getUser();
    this.userId = this.user.id;
    //this.checkRole();

    console.log("INIT OUTSIDE SERVICE: "+this.projHost);
    console.log("INIT OUTSIDE SERVICE: "+this.projAdmins);
    console.log(this.userId);
    console.log(this.status);

    //check project status
    if(this.status == "completed") {
      this.isCompleted = true;
    } else if(this.status == "closed") {
      this.isDeleted = true;
    } else {
      this.isOngoing = true;
    }

    //check user role
    if(this.userId == this.projHost) {
      this.isCreator = true;
    } else {
      for (var x = 0; x < this.projAdmins.length; x++) {
        if (this.userId == this.projAdmins[x]) {
          this.isAdmin = true;
          console.log("count: " + x);
        }
      }
    }
    console.log("isCreator: " + this.isCreator);
    console.log("isAdmin: " + this.isAdmin);
    console.log("isCompleted: " + this.isCompleted);
    console.log("isDeleted: " + this.isDeleted);
    console.log("isOngoing: " + this.isOngoing);

    //getKPIs
    await this.projectService.getProjectKPIs({id: this.projectId}).toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.KPIs = response.data.kpis;
        console.log(this.KPIs);
      }
    );
    console.log(this.KPIs);

  }

  async loadProject() {
    await this.projectService.viewProject({ id: this.projectId }).toPromise().then(
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

    console.log("LOAD PROJ OUTSIDE SERVICE: "+this.projHost);
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
    }

    console.log(this.isCreator);
    console.log(this.isAdmin);
  }

  deleteProj(title: string): void {
    this.projectService.deleteProject({id: this.projectId}).subscribe(
      response => {
        console.log(JSON.stringify(response));
        alert("Project " + title +  " has been deleted");
        window.close();
      },
      err => {
        console.log(JSON.stringify(err.error.msg));
      }
    );
  }

  completeProj(title: string): void {
    this.projectService.completeProject({id: this.projectId}).subscribe(
      response => {
        console.log(JSON.stringify(response));
        alert("Project " + title +  " has been completed!");
        window.location.reload();
      },
      err => {
        console.log(JSON.stringify(err.error.msg));
      }
    );
  }

  onSubmit(): void {
    const formCreateKPI = {
      id: this.projectId,
      title: this.form.title,
      desc: this.form.desc
    }
    console.log(formCreateKPI);

    this.projectService.createKPI(formCreateKPI).subscribe(
      response => {
        console.log(JSON.stringify(response));
        alert("KPI Created!");
        window.location.reload();
      }, 
      err => {
        this.errorMsg = err.error.msg;
        console.log(this.errorMsg);
      }
    );
  }

  getForm(kid: string, ktitle: string, kdesc: string, kcompletion: number): void {
    console.log(kid+ " "+ktitle+" "+kdesc+" "+kcompletion);
    this.updateForm = {
      id: kid,
      title: ktitle,
      desc: kdesc,
      completion: kcompletion
    }
  }

  onUpdate(): void {
    const formUpdateKPI = {
      id: this.updateForm.id,
      title: this.updateForm.title,
      desc: this.updateForm.desc,
      completion: this.updateForm.completion
    }
    console.log(formUpdateKPI);

    this.projectService.updateKPI(formUpdateKPI).subscribe(
      response => {
        console.log(JSON.stringify(response));
        alert("KPI Updated!");
        window.location.reload();
      }, 
      err => {
        this.errorMsg = err.error.msg;
        console.log(this.errorMsg);
      }
    );
  }

  deleteKPI(kid: string): void {
    console.log(kid);
    this.projectService.deleteKPI({id: kid}).subscribe(
      response => {
        console.log(JSON.stringify(response));
        alert("KPI deleted!");
        window.location.reload();
      },
      err => {
        this.errorMsg = err.error.msg;
        console.log(this.errorMsg);
      }
    );
  }

}
