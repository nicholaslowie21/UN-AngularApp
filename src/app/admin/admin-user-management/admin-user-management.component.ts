import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ProjectService } from '../../services/project.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent implements OnInit {

  thisUser: any;

  admins: any;
  regionalAdmins: any;
  adminLeads: any;

  faSearch = faSearch;
  searchType = 'Select';
  keyword = '';
  searchResults: any;
  isSearchSuccessful: any;
  errorMsgSearch = '';

  checkUser: any;

  constructor(private adminService: AdminService, private tokenStorageService: TokenStorageService, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.thisUser = this.tokenStorageService.getUser();
  }

  viewUser(username: string): string {
    let usernameFormatted = '';
    for(var i=0; i<username.length; i++) {
      if(username.charAt(i)==' ') {
        usernameFormatted = usernameFormatted.concat('%20');
      } else {
        usernameFormatted = usernameFormatted.concat(username.charAt(i));
      }
    }
    return "http://localhost:4200/admin/user-management/profile?username="+usernameFormatted;
  }

  searchUserProject(): void {
    if (this.searchType == 'Select') {
      this.errorMsgSearch = 'Select search type';
      this.isSearchSuccessful = false;
      return;
    }
    if (this.keyword.length == 0) {
      this.errorMsgSearch = 'Enter a username';
      this.isSearchSuccessful = false;
      return;
    }

    if (this.searchType == 'individual') {
      this.adminService.searchUser({ username: this.keyword }).subscribe(
        response => {
          console.log(response.data.users);
          this.searchResults = response.data.users;
          this.isSearchSuccessful = true;
        },
        err => {
          this.errorMsgSearch = err.error.msg;
          this.isSearchSuccessful = false;
        }
      )
    } else if (this.searchType == 'project') {
      this.projectService.searchProject({ code: this.keyword }).subscribe(
        response => {
          this.searchResults = response.data.projects;
          this.isSearchSuccessful = true;
        },
        err => {
          this.errorMsgSearch = err.error.msg;
          this.isSearchSuccessful = false;
        }
      )
    } else {
      this.adminService.searchInstitution({ username: this.keyword }).subscribe(
        response => {
          this.searchResults = response.data.institutions;
          this.isSearchSuccessful = true;
        },
        err => {
          this.errorMsgSearch = err.error.msg;
          this.isSearchSuccessful = false;
        }
      )
    }
  }

  activateUser(x: any): void {
    this.checkUser = x;
    console.log(this.checkUser);
    this.adminService.activateUser({ id: this.checkUser }).subscribe(
      response => {
        alert("User has been activated!");
        this.searchUserProject();
        // console.log(JSON.stringify(response));
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  suspendUser(y: any): void {
    this.checkUser = y;
    console.log(this.checkUser);
    this.adminService.suspendUser({ id: this.checkUser }).subscribe(
      response => {
        alert("User has been suspended!");
        this.searchUserProject();
        // console.log(JSON.stringify(response));
      },
      err => {
        alert(err.error.msg);
      }
    )
  }
  
  activateProject(x: any): void {
    this.adminService.activateProject({ id: x }).subscribe(
      response => {
        alert("Project has been activated!");
        this.searchUserProject();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  suspendProject(x: any): void {
    this.adminService.suspendProject({ id: x }).subscribe(
      response => {
        alert("Project has been suspended!");
        this.searchUserProject();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

}
