import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { InstitutionService } from '../services/institution.service';
import { ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-share-profile-page',
  templateUrl: './share-profile-page.component.html',
  styleUrls: ['./share-profile-page.component.css']
})
export class ShareProfilePageComponent implements OnInit {

  isShareProfile = true;
  username: string;
  userType: string;
  user: any;
  isIndividual = false;
  isVerified = false;

  currentProj: any;
  pastProj: any;
  badges: any;

  knowledge: any = [];
  manpower: any = [];
  item: any = [];
  venue: any = [];

  constructor(private route: ActivatedRoute, private userService: UserService, private institutionService: InstitutionService, private resourceService: ResourceService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.username = params.username;
        this.userType = params.userType;
      }
    )
    
    if(this.userType == "individual") {
      this.isIndividual = true;
      this.userService.viewUserProfile({username: this.username}).subscribe(
        response => {
          this.user = response.data.targetUser;
          this.loadUserData(this.user);
          if(this.user.isVerified == "true") {
            this.isVerified = true;
          }
        }
      )
    } else if(this.userType == "institution") {
      this.isIndividual = false;
      this.institutionService.viewInstitutionProfile({username: this.username}).subscribe(
        response => {
          this.user = response.data.targetInstitution;
          this.loadInstitutionData(this.user);
          if(this.user.isVerified) {
            this.isVerified = true;
          }
        }
      )
    }
  }

  loadUserData(user): void {
    this.userService.getCurrentProjects({ id: user.id }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.currentProj = response.data.currProjects;
        console.log(JSON.stringify(this.currentProj));
      }
    );
    this.userService.getPastProjects({ id: user.id }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.pastProj = response.data.pastProjects;
        console.log(JSON.stringify(this.pastProj));
      }
    );
    this.resourceService.getUserKnowledge({ id: user.id }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.knowledge = response.data.knowledges;
        console.log(JSON.stringify(this.knowledge));
      }
    );

    this.resourceService.getUserItem({ id: user.id }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.item = response.data.items;
        console.log(JSON.stringify(this.item));
      }
    );

    this.resourceService.getUserManpower({ id: user.id }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.manpower = response.data.manpowers;
        console.log(JSON.stringify(this.manpower));
      }
    );

    this.resourceService.getUserVenue({ id: user.id }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.venue = response.data.venues;
        console.log(JSON.stringify(this.venue));
      }
    );
  }

  loadInstitutionData(institution): void {
      this.institutionService.getCurrentProjects({ id: institution.id }).subscribe(
        response => {
          console.log(JSON.stringify(response));
          this.currentProj = response.data.currProjects;
          console.log(JSON.stringify(this.currentProj));
        }
      );

      this.institutionService.getPastInvolvement({ id: institution.id }).subscribe(
        response => {
          console.log(JSON.stringify(response));
          this.pastProj = response.data.pastProjects;
          console.log(JSON.stringify(this.pastProj));
        }
      );

      this.resourceService.getInstitutionKnowledge({ id: institution.id }).subscribe(
        response => {
          console.log(JSON.stringify(response));
          this.knowledge = response.data.knowledges;
          console.log(JSON.stringify(this.knowledge));
        }
      );

      this.resourceService.getInstitutionItem({ id: institution.id }).subscribe(
        response => {
          console.log(JSON.stringify(response));
          this.item = response.data.items;
          console.log(JSON.stringify(this.item));
        }
      );

      this.resourceService.getInstitutionVenue({ id: institution.id }).subscribe(
        response => {
          console.log(JSON.stringify(response));
          this.venue = response.data.venues;
          console.log(JSON.stringify(this.venue));
        }
      );
  }

}
