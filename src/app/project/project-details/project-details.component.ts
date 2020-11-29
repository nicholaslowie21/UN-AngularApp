import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { MessageService } from 'primeng/api';
import { ReportService } from '../../services/report.service';
import { Calendar } from '@fullcalendar/core';
import { FullCalendar } from 'primeng/fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { TargetService } from '../../services/target.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  providers: [MessageService]
})
export class ProjectDetailsComponent implements OnInit {

  eventOn = false;
  @ViewChild('calendar', { static: true })
  calendar: FullCalendar;
  options = {
    plugins: [dayGridPlugin, timeGridPlugin],
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventClick: (el) => this.callEvent(el.event),
    displayEventTime: false
  };

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

  calendarOn = false;
  minimumDate = new Date();
  events = [];
  //options: any;
  //header: any;
  eventTitle: any;
  eventStart: any;
  eventEnd: any;
  eventStat: any;

  updateEvent: any = {};
  selectEvent: any;
  uEventNotif = false;
  cEventNotif = false;
  tempType: any;

  targets: any;
  tempEv: any = [];
  privateEv: any = [];
  publicEv: any = [];

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private userService: UserService,
    private tokenStorageService: TokenStorageService, private messageService: MessageService, private reportService: ReportService, 
    private router: Router, private targetService: TargetService) {
    const name = FullCalendar.name;
  }

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
    } else if(this.status == 'ongoing') {
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
    console.log(this.user.username);
    for (var x = 0; x < this.contributors.length; x++) {
      if (this.user.username == this.contributors[x].contributorUsername) {
        this.isContributor = true;
        console.log("count: " + x);
      }
    }
    console.log(this.isContributor);
    console.log(this.contributors.length);

    await this.projectService.getProjectPosts({ id: this.projectId }).toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.projPosts = response.data.projectPosts;
      }
    );
    console.log(this.projPosts);

    if (this.isContributor) {
      await this.projectService.getAllProjectEvents({ id: this.projectId }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.tempEv = response.data.projectEvents;
          for(var x = 0; x < this.tempEv.length; x++) {
            if(this.tempEv[x].eventType == "public") {
              this.tempEv[x].color = "rgb(49, 173, 0)";
              this.publicEv.push(this.tempEv[x]);
            } else {
              this.tempEv[x].color =  "rgb(168, 0, 0)";
              this.privateEv.push(this.tempEv[x]);
            }
          }
          this.events = this.events.concat(this.publicEv);
          this.events = this.events.concat(this.privateEv);
          //this.events = response.data.projectEvents;
        }
      );
      console.log(this.events);
    } else {
      await this.projectService.getPublicProjectEvents({ id: this.projectId }).toPromise().then(
        response => {
          console.log(JSON.stringify(response));
          this.tempEv = response.data.projectEvents;
          for(var x = 0; x < this.tempEv.length; x++) {
            this.tempEv[x].color = "rgb(49, 173, 0)";
          }
          this.events = this.tempEv;
        }
      );
      console.log(this.events);
    }

    await this.targetService.getProjectTargets({ id: this.projectId }).toPromise().then(
      response => this.targets = response.data.targets
    );
  }
    
  deleteProj(title: string): void {
    let r = confirm("Are you sure you want to delete this project?");
    if(r == true) {
      this.projectService.deleteProject({ id: this.projectId }).subscribe(
        response => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Project '+ title +' has been deleted'});
          //this.ngOnInit();
          window.location.reload();
        },
        err => {
          alert("Error: " + err.error.msg);
        }
      );
    } else {
      return;
    }
  }

  completeProj(title: string): void {
    let r = confirm("Are you sure you want to complete this project?");
    if(r == true) {
      this.projectService.completeProject({ id: this.projectId }).subscribe(
        response => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Project ' + title + ' completed successfully!'});
          window.location.reload();
        },
        err => {
          alert("Error: " + err.error.msg);
        }
      );
    } else {
      return;
    }
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
    return formattedDate.substring(5, formattedDate.length - 13);
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
    await this.projectService.getPostComment({ id: pid }).toPromise().then(
      res => {
        console.log(JSON.stringify(res));
        this.allComments = res.data.postComments
      }
    );
    this.tempId = pid;
    console.log(this.tempId);

    if (this.allComments.length == 0) {
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

    this.projectService.deletePostComment({ id: pid }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Comment Deleted!' });
        window.location.reload();
      }
    );
  }

  myComment(aId: string): boolean {
    if (this.userId == aId) {
      return true;
    }
    return false;
  }

  switchCalendarOn(): void {
    this.calendarOn = true;
    this.eventOn = false;
  }

  switchCalendarOff(): void {
    this.calendarOn = false;
  }

  onEventPost(): void {
    console.log(this.form);
    console.log(this.projectId);
    console.log(this.form.type.toLowerCase());
    //console.log(new Date(this.form.endDate));
    //console.log(new Date(this.form.startDate));
    console.log(new Date(this.form.endDate) > new Date(this.form.startDate));
    var a = new Date(this.form.endDate);
    var b = new Date(this.form.startDate);
    if (a < b) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: "The start date is after the end date!" });
    } /**else if (a.getTime() === b.getTime()) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: "End date cannot be the same as start date!" });
    } **/ else {
      const formEvent = {
        id: this.projectId,
        title: this.form.title,
        start: this.form.startDate,
        end: this.form.endDate,
        type: this.form.type.toLowerCase()
      }

      this.projectService.createProjectEvent(formEvent).subscribe(
        response => {
          console.log(JSON.stringify(response));
          //this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Event Added!' });
          //this.ngOnInit();
          this.cEventNotif = true;
          this.events = [];
          this.privateEv = [];
          this.publicEv = [];
          //window.location.reload();
        },
        err => {
          this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
          this.errorMsg = err.error.msg;
          console.log(this.errorMsg);
        }
      );
    }
  }

  onEventUpdate(): void {
    console.log(this.updateEvent);
    
    //this.updateEvent.end.setUTCHours(0);
    //this.updateEvent.start.setUTCHours(0);
    //console.log(this.updateEvent.end.toUTCString());
    //console.log(this.updateEvent.start.toUTCString());

    console.log(this.updateEvent.end);
    console.log(this.updateEvent.start);
    var a = new Date(this.updateEvent.end).toDateString();
    var b = new Date(this.updateEvent.start).toDateString();
    var c = new Date(this.updateEvent.end);
    var d = new Date(this.updateEvent.start);
    console.log(a);
    console.log(b);
    console.log(a.substring(11,15));
    console.log(a.substring(8,10));
    console.log(a.substring(4,7));
    console.log(new Date(a).getTime());
    console.log("check date: " + (a==b) );

    //one-day event
    if(a == b) {
      this.updateEvent.type = this.updateEvent.type.toLowerCase();
      this.projectService.updateProjectEvent(this.updateEvent).subscribe(
        response => {
          this.uEventNotif = true;
        },
        err => {
          this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
          this.errorMsg = err.error.msg;
          console.log(this.errorMsg);
        }
      );
    } else {
      if (c < d) {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: "The start date is after the end date!" });
      } else {
        this.updateEvent.type = this.updateEvent.type.toLowerCase();
        this.projectService.updateProjectEvent(this.updateEvent).subscribe(
          response => {            
            this.uEventNotif = true;
          },
          err => {
            this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
            this.errorMsg = err.error.msg;
            console.log(this.errorMsg);
          }
        );
      }
    }

  }

  callEvent(info): void {
    this.uEventNotif = false;
    this.eventOn = true;
    console.log(info.title + " " + info.start + " " + info.end + " " + info.eventType);
    console.log("event id: " + info.id);

    this.findEvent(info.id);
    this.eventTitle = info.title;
    this.eventStart = this.selectEvent.start;
    this.eventEnd = this.selectEvent.end;
    this.eventStat = info.eventType;

    if(info.end == null) {
      this.updateEvent = {
        id: info.id,
        title: this.eventTitle,
        start: info.start,
        end: info.start,
        type: this.selectEvent.eventType
      }
    } else {
      this.updateEvent = {
        id: info.id,
        title: this.eventTitle,
        start: info.start,
        end: info.end,
        type: this.selectEvent.eventType
      }
    }
    

    if (this.updateEvent.type == "public") {
      this.updateEvent.type = "Public";
      this.tempType = "Public";
    } else {
      this.updateEvent.type = "Private";
      this.tempType = "Private";
    }

    console.log(this.updateEvent);
  }

  findEvent(id): any {
    for (var x = 0; x < this.events.length; x++) {
      if (id == this.events[x].id) {
        this.selectEvent = this.events[x];
        console.log("event id: " + this.events[x].id);
        console.log(this.selectEvent);
      }
    }
  }

  confirmDelEvent(): void {
    let r = confirm("Are you sure you want to delete this event?");
    if (r == true) {
      this.deleteEvent();
    } else {
      return;
    }
  }

  deleteEvent(): void {
    this.projectService.deleteProjectEvent({ id: this.updateEvent.id }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Event Deleted!' });
        this.eventOn = false;
        this.events = [];
        this.privateEv = [];
        this.publicEv = [];
        this.ngOnInit();
        //window.location.reload();
      }
    );
  }

  clickReport(): void {
    this.isReport = true;
  }

  closeModalReport(): void {
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
        console.log(JSON.stringify(response));
      }, err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    );
  }

  closeModal(): void {
    this.eventOn = false;
    this.cEventNotif = false;
    this.uEventNotif = false;
    this.form = {};
    this.events = [];
    this.publicEv = [];
    this.privateEv = [];
    this.ngOnInit();
  }

  viewTarget(): void {
    this.closeModal();
    this.router.navigate(['/edit-target'], {queryParams: {type: 'project', id: this.projectId}});
  }
}
