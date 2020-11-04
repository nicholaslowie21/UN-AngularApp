import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { MessageService } from 'primeng/api';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  providers: [MessageService]
})
export class ProjectDetailsComponent implements OnInit {

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
  isUpdateSuccessful = false;
  KPIs: any;
  updateForm: any = {};

  image: any;
  imgString: any;

  admins: any;
  host: any;
  contributors: any;

  projPosts: any;
  updatePost: any = {};

  newComment: any;
  allComments: any;
  tempId: any;
  checkComment = false;

  isReport = false;
  isReportSuccessful = false;
  formReport: any = {};

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private userService: UserService,
    private tokenStorageService: TokenStorageService, private messageService: MessageService, private reportService: ReportService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.projectId = params.id;
      }
      );
    
    await this.projectService.viewProject({ id: this.projectId }).toPromise().then(
      response => {
        this.project = response.data.targetProject;
        this.projHost = response.data.targetProject.host;
        this.projAdmins = response.data.targetProject.admins;
        this.status = response.data.targetProject.status;
        this.imgString = "https://localhost:8080" + this.project.imgPath;
      },
      err => {
        alert(err.error.msg);
      }
    );

    this.user = this.tokenStorageService.getUser();
    this.userId = this.user.id;

    //check project status
    if (this.status == "completed") {
      this.isCompleted = true;
    } else if (this.status == "closed") {
      this.isDeleted = true;
    } else {
      this.isOngoing = true;
    }

    //check user role
    if (this.userId == this.projHost) {
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
    await this.projectService.getProjectKPIs({ id: this.projectId }).toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.KPIs = response.data.kpis;
        console.log(this.KPIs);
      }
    );
    console.log(this.KPIs);

    await this.projectService.getAdmins({ id: this.projectId }).toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.admins = response.data.admins;
      }
    );
    console.log(this.admins);

    await this.projectService.getProjectHost({ id: this.projectId }).toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.host = response.data.host;
      }
    );

    await this.projectService.getProjectContributors({ id: this.projectId }).toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.contributors = response.data.contributors;
      }
    );
    console.log(this.contributors);

    await this.projectService.getProjectPosts({ id: this.projectId}).toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.projPosts = response.data.projectPosts;
      }
    );
    console.log(this.projPosts);

    //check isContributor
    for(var i=0; i<this.contributors.length; i++) {
      if(this.contributors[i].contributionType == 'contributor' && this.contributors[i].contributorUsername == this.user.username) {
        this.isContributor = true;
      }
    }

  }

  deleteProj(title: string): void {
    this.projectService.deleteProject({ id: this.projectId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        //this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Project '+ title +' has been deleted'});
        //this.ngOnInit();
        // alert("Project " + title + " has been deleted");
        window.location.reload();
      },
      err => {
        alert("Error: " + err.error.msg);
        console.log(JSON.stringify(err.error.msg));
      }
    );
  }

  completeProj(title: string): void {
    this.projectService.completeProject({ id: this.projectId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        // alert("Project " + title + " has been completed!");
        window.location.reload();
      },
      err => {
        alert("Error: " + err.error.msg);
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
        // alert("KPI Created!");
        window.location.reload();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        this.errorMsg = err.error.msg;
        console.log(this.errorMsg);
      }
    );
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  getForm(kid: string, ktitle: string, kdesc: string, kcompletion: number): void {
    console.log(kid + " " + ktitle + " " + kdesc + " " + kcompletion);
    this.updateForm = {
      id: kid,
      title: ktitle,
      desc: kdesc,
      completion: kcompletion
    }
  }

  getPost(pid: string, ptitle: string, pdesc: string, pimg: string): void {
    console.log(pid + " " + ptitle + " " + pdesc + " " + pimg);
    this.updatePost = {
      id: pid,
      title: ptitle,
      desc: pdesc,
      imgPath: pimg
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
        // alert("KPI Updated!");
        window.location.reload();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        this.errorMsg = err.error.msg;
        console.log(this.errorMsg);
      }
    );
  }

  deleteKPI(kid: string): void {
    console.log(kid);
    this.projectService.deleteKPI({ id: kid }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'KPI deleted!' });
        this.ngOnInit();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        console.log(err.error.msg);
      }
    );
  }

  deleteProject(title: string): void {
    let r = confirm("Are you sure you want to delete this project?");
    if (r == true) {
      this.deleteProj(title);
    } else {
      return;
    }
  }

  completeProject(title: string): void {
    let r = confirm("Are you sure you want to mark this project as complete?");
    if (r == true) {
      this.completeProj(title);
    } else {
      return;
    }
  }

  confirmDeleteKPI(id: string): void {
    let r = confirm("Are you sure you want to delete this KPI?");
    if (r == true) {
      this.deleteKPI(id);
    } else {
      return;
    }
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
      console.log(this.image);
    }
  }

  onPost(): void {
    /**const formPost = {
      id: this.projectId,
      title: this.form.title,
      desc: this.form.desc,
      img: this.image
    }
    console.log(formPost); **/
    
    const formData = new FormData();
    formData.append("projectId", this.projectId);
    formData.append("title", this.form.title);
    formData.append("desc", this.form.desc);
    formData.append("postImg", this.image);

    console.log(this.image);
    //console.log(JSON.stringify (formData));

    this.projectService.createProjectPost(formData).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Post Created!' });
        window.location.reload();
        //this.ngOnInit();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        this.errorMsg = err.error.msg;
        console.log(this.errorMsg);
      }
    );
  }

  onUpdatePost(): void {
    /**const formUpdatePost = {
      id: this.updatePost.id,
      title: this.updatePost.title,
      desc: this.updatePost.desc,
      img: this.updatePost.imgPath
    }
    console.log(formUpdatePost); **/

    const formData = new FormData();
    formData.append("postId", this.updatePost.id);
    formData.append("title", this.updatePost.title);
    formData.append("desc", this.updatePost.desc);
    formData.append("postImg", this.image);

    console.log(this.image);

    this.projectService.updateProjectPost(formData).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Post Updated!' });
        window.location.reload();
        //this.ngOnInit();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        this.errorMsg = err.error.msg;
        console.log(this.errorMsg);
      }
    );
  }

  confirmDeletePost(id: string): void {
    let r = confirm("Are you sure you want to delete this post?");
    if (r == true) {
      this.deletePost(id);
    } else {
      return;
    }
  }

  deletePost(pid: string): void {
    console.log(pid);
    this.projectService.deleteProjectPost({ id: pid }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Post deleted!' });
        this.ngOnInit();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        console.log(err.error.msg);
      }
    );
  }

  addComment(): void {
    console.log(this.newComment + " " + this.tempId);
    
    const formAddComment = {
      id: this.tempId,
      comment: this.newComment
    }
    console.log(formAddComment);

    this.projectService.createPostComment(formAddComment).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Comment Added!' });
        window.location.reload();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        this.errorMsg = err.error.msg;
        console.log(this.errorMsg);
      }
    );
  }

  async getComments(pid: string) {
    await this.projectService.getPostComment({id: pid}).toPromise().then(
      res => { 
        console.log(JSON.stringify(res));
        this.allComments = res.data.postComments}
    );
    this.tempId = pid;
    console.log(this.tempId);

    if(this.allComments.length==0) {
      this.checkComment = false;
      console.log("length 0");
    } else {
      this.checkComment = true;
      console.log("length not 0");
    }
  }

  confirmDelCom(pid: string): void {
    let r = confirm("Are you sure you want to delete this comment?");
    if (r == true) {
      this.deleteComment(pid);
    } else {
      return;
    }
  }

  deleteComment(pid: string): void {
   
      this.projectService.deletePostComment({id: pid}).subscribe(
        response => {
          console.log(JSON.stringify(response));
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Comment Deleted!' });
          window.location.reload();
        }
      );
  }

  myComment(aId: string): boolean {
    if(this.userId == aId) {
      return true;
    }
    return false;
  }

  clickReport(): void {
    this.isReport = true;
  }

  closeModal(): void {
    this.isReport = false;
    this.isReportSuccessful = false;
    this.formReport.title = '';
    this.formReport.summary = '';
  }

  submitReport(): void {
    const reportForm = {
      title: this.formReport.title,
      summary: this.formReport.summary,
      type: 'project',
      id: this.projectId
    }

    this.reportService.createReport(reportForm).subscribe(
      response => {
        this.isReportSuccessful = true;
      }, err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    );
  }

}
