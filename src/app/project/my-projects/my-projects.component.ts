import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { InstitutionService } from '../../services/institution.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ProjectService } from '../../services/project.service';
import { faBreadSlice } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  username: any;
  type: any;
  user: any;
  isOwner = false;

  loggedInUser: any;
  isVerified = false;
  userId: any;
  currProj: any;
  pastProj: any;

  projId: any;
  role: any;

  hostId: any;

  filterOptions: any = [];

  constructor(private tokenStorageService: TokenStorageService, private userService: UserService, 
    private projectService: ProjectService, private route: ActivatedRoute, private institutionService: InstitutionService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.username = params.username;
        this.type = params.type;
      }
    );

    if (this.type == 'individual') {
      await this.userService.viewUserProfile({username: this.username}).toPromise().then(
        res => this.user = res.data.targetUser
      );
    } else {
      await this.institutionService.viewInstitutionProfile({username: this.username}).toPromise().then(
        res => this.user = res.data.targetInstitution
      );
    }

    this.userId = this.user.id;
    this.loggedInUser = this.tokenStorageService.getUser();
    
    if(this.user.id == this.loggedInUser.id) {
      this.isOwner = true;
    }

    if (this.loggedInUser.isVerified == "true" || this.loggedInUser.isVerified) {
      this.isVerified = true;
    }

    this.filterOptions = [
      { label: 'All', value: 'all' },
      { label: 'Founder', value: 'creator' },
      { label: 'Admin', value: 'admin' },
      { label: 'Contributor', value: 'contributor' },
    ];

    if(this.type == 'individual') {
      this.userService.getCurrentProjects({ id: this.userId }).subscribe(
        response => {
          this.currProj = response.data.currProjects;
        }
      );
  
      this.userService.getPastProjects({ id: this.userId }).subscribe(
        response => {
          this.pastProj = response.data.pastProjects;
        }
      );
    } else {
      await this.institutionService.getCurrentProjects({id: this.userId}).toPromise().then(
        res => this.currProj = res.data.currProjects
      );
      await this.institutionService.getPastInvolvement({id: this.userId}).toPromise().then(
        res => this.pastProj = res.data.pastProjects
      );
    }
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
        for (var j = 0; j < this.currProj[i].admins.length; j++) {
          if (this.currProj[i].admins[j] == this.user.id) {
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
        for (var j = 0; j < this.pastProj[i].admins.length; j++) {
          if (this.pastProj[i].admins[j] == this.user.id) {
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

  checkRole(project): string {
    if(project.host == this.user.id) {
      return 'Founder';
    }
    for(var i=0; i<project.admins.length; i++) {
      if(project.admins[i] == this.user.id) {
        return 'Admin';
      }
    }
    return 'Contributor';
  }

}
