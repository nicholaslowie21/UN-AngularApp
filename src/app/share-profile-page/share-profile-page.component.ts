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

  currentProj: any = [];
  pastProj: any = [];
  badges: any = [];

  knowledge: any = [];
  manpower: any = [];
  item: any = [];
  venue: any = [];

  resourceOffers = [];

  constructor(private route: ActivatedRoute, private userService: UserService, private institutionService: InstitutionService, private resourceService: ResourceService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.username = params.username;
        this.userType = params.userType;
      }
    )
    
    if(this.userType == "individual") {
      this.isIndividual = true;
      await this.userService.viewUserProfile({username: this.username}).toPromise().then(
        async response => {
          this.user = response.data.targetUser;
          await this.loadUserData(this.user);
          if(this.user.isVerified == "true") {
            this.isVerified = true;
          }
        }
      )
    } else if(this.userType == "institution") {
      this.isIndividual = false;
      await this.institutionService.viewInstitutionProfile({username: this.username}).toPromise().then(
        async response => {
          this.user = response.data.targetInstitution;
          await this.loadInstitutionData(this.user);
          if(this.user.isVerified) {
            this.isVerified = true;
          }
        }
      )
    }
    this.resourceOffers.sort(this.sortFunction);
  }

  async loadUserData(user) {
    await this.userService.getCurrentProjects({ id: user.id }).toPromise().then(
      response => {
        this.currentProj = response.data.currProjects;
      }
    );
    await this.userService.getPastProjects({ id: user.id }).toPromise().then(
      response => {
        this.pastProj = response.data.pastProjects;
      }
    );
    await this.resourceService.getUserKnowledge({ id: user.id }).toPromise().then(
      response => {
        this.knowledge = response.data.knowledges;
        for(var i=0; i<response.data.knowledges.length; i++) {
          response.data.knowledges[i].type = 'knowledge';
        }
        this.resourceOffers = this.resourceOffers.concat(response.data.knowledges);
      }
    );
    await this.resourceService.getUserItem({ id: user.id }).toPromise().then(
      response => {
        this.item = response.data.items;
        for(var i=0; i<response.data.items.length; i++) {
          response.data.items[i].type = 'item';
        }
        this.resourceOffers = this.resourceOffers.concat(response.data.items);
      }
    );
    await this.resourceService.getUserManpower({ id: user.id }).toPromise().then(
      response => {
        this.manpower = response.data.manpowers;
        for(var i=0; i<response.data.manpowers.length; i++) {
          response.data.manpowers[i].type = 'manpower';
        }
        this.resourceOffers = this.resourceOffers.concat(response.data.manpowers);
      }
    );
    await this.resourceService.getUserVenue({ id: user.id }).toPromise().then(
      response => {
        this.venue = response.data.venues;
        for(var i=0; i<response.data.venues.length; i++) {
          response.data.venues[i].type = 'venue';
        }
        this.resourceOffers = this.resourceOffers.concat(response.data.venues);
      }
    );
  }

  async loadInstitutionData(institution) {
    await this.institutionService.getCurrentProjects({ id: institution.id }).toPromise().then(
        response => {
          this.currentProj = response.data.currProjects;
        }
      );

      await this.institutionService.getPastInvolvement({ id: institution.id }).toPromise().then(
        response => {
          this.pastProj = response.data.pastProjects;
        }
      );

      await this.resourceService.getInstitutionKnowledge({ id: institution.id }).toPromise().then(
        response => {
          this.knowledge = response.data.knowledges;
          for(var i=0; i<response.data.knowledges.length; i++) {
            response.data.knowledges[i].type = 'knowledge';
          }
          this.resourceOffers = this.resourceOffers.concat(response.data.knowledges);
        }
      );

      await this.resourceService.getInstitutionItem({ id: institution.id }).toPromise().then(
        response => {
          this.item = response.data.items;
          for(var i=0; i<response.data.items.length; i++) {
            response.data.items[i].type = 'item';
          }
          this.resourceOffers = this.resourceOffers.concat(response.data.items);
        }
      );

      await this.resourceService.getInstitutionVenue({ id: institution.id }).toPromise().then(
        response => {
          this.venue = response.data.venues;
          for(var i=0; i<response.data.venues.length; i++) {
            response.data.venues[i].type = 'venue';
          }
          this.resourceOffers = this.resourceOffers.concat(response.data.venues);
        }
      );
  }

  sortFunction(a, b) {
    var dateA = new Date(a.updatedAt).getTime();
    var dateB = new Date(b.updatedAt).getTime();
    return dateA > dateB ? -1 : 1;
  }

}
