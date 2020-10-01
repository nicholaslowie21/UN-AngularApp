import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-project-admin',
  templateUrl: './edit-project-admin.component.html',
  styleUrls: ['./edit-project-admin.component.css'],
  providers: [MessageService]
})
export class EditProjectAdminComponent implements OnInit {

  projectId: any;
  admins: any;
  keyword = '';
  searchResults: any;
  isSearchSuccessful: any;
  errorMsgSearch = '';
  isAddSuccessful = false;
  isDelSuccessful = false;
  errorMessage: any;

  user: any;
  userId: any;

  isProjHost = false;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, 
    private tokenStorageService: TokenStorageService, private messageService: MessageService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        //this.projectCode = params.code;
        this.projectId = params.id;
      }
      );
    console.log(this.projectId);
    await this.projectService.getAdmins({ id: this.projectId }).toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.admins = response.data.admins;
      }
    );
    console.log(this.admins);

    this.user = this.tokenStorageService.getUser();
    this.userId = this.user.id;
    console.log(this.userId);

    await this.projectService.viewProject({ id: this.projectId }).toPromise().then(
      response => {
        if(response.data.targetProject.host == this.user.id) {
          this.isProjHost = true;
        }
      }
    )
  }

  searchUsers(): void {
    if (this.keyword.length == 0) {
      this.isSearchSuccessful = false;
      this.errorMsgSearch = 'Please enter a username';
      return;
    }
    this.projectService.searchUsers({ username: this.keyword }).subscribe(
      response => {
        this.searchResults = response.data.users;
        if (this.searchResults.length == 0) {
          this.isSearchSuccessful = false;
          this.errorMsgSearch = 'No users found';
        } else {
          this.isSearchSuccessful = true;
        }
      },
      err => {
        this.errorMsgSearch = err.error.msg;
        this.isSearchSuccessful = false;
      }
    )
  }

  alreadyAdmin(user): boolean {
    for (var i = 0; i < this.admins.length; i++) {
      if (this.admins[i].username == user.username) {
        return true;
      }
    }
    return false;
  }

  alreadyHost(user): boolean {
    if(this.userId == user.id) {
      return true;
    }
    return false;
  }

  addAdminAlert(uId: string, name: string): void{
    let r = confirm("Are you sure you want to add user as project admin?");
    if (r == true) {
      this.addAdmin(uId, name);
    } else {
      return;
    }
  }

  addAdmin(uId: string, name: string): void {
    const addAdm = {
      id: this.projectId,
      userId: uId
    }
    console.log(addAdm);

    this.projectService.addProjectAdmin(addAdm).subscribe(
      response => {
        this.isAddSuccessful = true;
        // alert("User " + name + " has been added as Project Admin");
        this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'User '+name+' has been added as Project Admin!'});
        this.ngOnInit();
        // window.location.reload();
      }, err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        this.errorMessage = err.error.msg;
        console.log(this.errorMessage);
        this.isAddSuccessful = false;
      }
    )
  }

  deleteAdminAlert(user): void{
    let r = confirm("Are you sure you want to remove this project admin?");
    if (r == true) {
      this.deleteAdmin(user);
    } else {
      return;
    }
  }

  deleteAdmin(user): void {
    const dAdmin = {
      id: this.projectId,
      userId: user.id
    }
    console.log(dAdmin);

    this.projectService.deleteProjectAdmin(dAdmin).subscribe(
      response => {
        this.isDelSuccessful = true;
        this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'User '+user.name+' has been removed from Project Admins!'});
        this.ngOnInit();
        // alert("User " + user.name + " has been removed from Project Admins");
        // window.location.reload();
      }, err => {
        console.log(JSON.stringify(err));
        this.errorMessage = err.error.msg;
        this.isDelSuccessful = false;
      }
    )
  }

}
