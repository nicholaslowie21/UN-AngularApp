import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ProjectService } from '../../services/project.service';
import { faBreadSlice } from '@fortawesome/free-solid-svg-icons';


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

  hostId: any;

  filterOptions: any = [];

  constructor(private tokenStorageService: TokenStorageService, private userService: UserService, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    this.userId = this.user.id;
    if (this.user.isVerified == "true") {
      this.isVerified = true;
    }
    this.filterOptions = [
      { label: 'All', value: 'all' },
      { label: 'Creator', value: 'creator' },
      { label: 'Admin', value: 'admin' },
      { label: 'Contributor', value: 'contributor' },
    ];
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

  async filterRoleCurrentProj(event) {
    await this.userService.getCurrentProjects({ id: this.userId }).toPromise().then(res => this.currProj = res.data.currProjects);
    let value = event.value;
    let arr = [];
    if (value == 'creator') {
      for (var i = 0; i < this.currProj.length; i++) {
        if (this.currProj[i].host == this.user.id) {
          arr.push(this.currProj[i]);
        }
      }
    } else if (value == 'admin') {
      for (var i = 0; i < this.currProj.length; i++) {
        console.log("check admin: " + this.currProj[i].admins);
        for (var j = 0; j < this.currProj[i].admins.length; j++) {
          console.log("***inner for loop")
          if (this.currProj[i].admins[j] == this.user.id) {
            console.log("isAdmin HERE")
            arr.push(this.currProj[i]);
            break;
          }
        }
      }
    } else if (value == 'contributor') {
      let isAdmin = false;
      for (var i = 0; i < this.currProj.length; i++) {
        if (this.currProj[i].host != this.user.id) {
          for (var j = 0; j < this.currProj[i].admins.length; j++) {
            if (this.currProj[i].admins[j] == this.user.id) {
              isAdmin = true;
              break;
            }
          }
          if (!isAdmin) {
            arr.push(this.currProj[i]);
          }
        }
      }
    } else {
      arr = this.currProj;
    }
    this.currProj = arr;
  }

  async filterRolePastProj(event) {
    await this.userService.getPastProjects({ id: this.userId }).toPromise().then(res => this.pastProj = res.data.pastProjects);
    let value = event.value;
    let arr = [];
    if (value == 'creator') {
      for (var i = 0; i < this.pastProj.length; i++) {
        if (this.pastProj[i].host == this.user.id) {
          arr.push(this.pastProj[i]);
        }
      }
    } else if (value == 'admin') {
      for (var i = 0; i < this.pastProj.length; i++) {
        console.log("check admin: " + this.pastProj[i].admins);
        for (var j = 0; j < this.pastProj[i].admins.length; j++) {
          console.log("***inner for loop")
          if (this.pastProj[i].admins[j] == this.user.id) {
            console.log("isAdmin HERE")
            arr.push(this.pastProj[i]);
            break;
          }
        }
      }
    } else if (value == 'contributor') {
      let isAdmin = false;
      for (var i = 0; i < this.pastProj.length; i++) {
        if (this.pastProj[i].host != this.user.id) {
          for (var j = 0; j < this.pastProj[i].admins.length; j++) {
            if (this.pastProj[i].admins[j] == this.user.id) {
              isAdmin = true;
              break;
            }
          }
          if (!isAdmin) {
            arr.push(this.pastProj[i]);
          }
        }
      }
    } else {
      arr = this.pastProj;
    }
    this.pastProj = arr;
  }

}
