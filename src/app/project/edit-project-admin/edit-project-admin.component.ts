import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-edit-project-admin',
  templateUrl: './edit-project-admin.component.html',
  styleUrls: ['./edit-project-admin.component.css']
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

  constructor(private route: ActivatedRoute, private projectService: ProjectService) { }

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

  addAdmin(uId: string, name: string): void {
    const addAdm = {
      id: this.projectId,
      userId: uId
    }
    console.log(addAdm);

    this.projectService.addProjectAdmin(addAdm).subscribe(
      response => {
        this.isAddSuccessful = true;
        alert("User " + name + " has been added as Project Admin");
        window.location.reload();
      }, err => {
        this.errorMessage = err.error.msg;
        console.log(this.errorMessage);
        this.isAddSuccessful = false;
      }
    )
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
        alert("User " + user.name + " has been removed from Project Admins");
        window.location.reload();
      }, err => {
        console.log(JSON.stringify(err));
        this.errorMessage = err.error.msg;
        this.isDelSuccessful = false;
      }
    )
  }

}
