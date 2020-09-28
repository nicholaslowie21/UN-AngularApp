import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons/faShareAlt';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faClipboard } from '@fortawesome/free-solid-svg-icons/faClipboard';
import { UserService } from '../services/user.service';
import { ResourceService } from '../services/resource.service';
import { InstitutionService } from '../services/institution.service';

@Component({
  selector: 'app-own-profile',
  templateUrl: './own-profile.component.html',
  styleUrls: ['./own-profile.component.css']
})
export class OwnProfileComponent implements OnInit {

  user: any;
  userType: any;
  isIndividual = false;
  isVerified = false;
  shareLink = '';
  faFacebookSquare = faFacebookSquare;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faWhatsapp = faWhatsapp;
  faTelegram = faTelegram;
  faShareAlt = faShareAlt;
  faPencilAlt = faPencilAlt;
  faCopy = faCopy;
  faClipboard = faClipboard;
  iFrameLink = '';
  copyIFrameLink = '';
  userId: any;

  currentProj: any = [];
  pastProj: any = [];
  badges: any = [];
  knowledge: any = [];
  manpower: any = [];
  item: any = [];
  venue: any = [];
  indAffiliations = [];

  resourceOffers = [];

  //projectList = Array;

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService, private userService: UserService,
    private resourceService: ResourceService, private institutionService: InstitutionService) { }

  async ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    console.log("USER: " + this.user.profilePic);
    this.shareLink = "http://localhost:4200/profile?username=" + this.user.username;
    this.iFrameLink = "http://localhost:4200/shareProfile?username=" + this.user.username;
    
    if (this.tokenStorageService.getAccountType() == "user") {
      this.userType = 'individual';
      this.isIndividual = true;
      if(this.user.isVerified == "true") {
        this.isVerified = true;
      }
      this.shareLink += "&userType=individual";
      this.iFrameLink += "&userType=individual";
    } else {
      this.userType = 'institution';
      if(this.user.isVerified) {
        this.isVerified = true;
      }
      this.shareLink += "&userType=institution";
      this.iFrameLink += "&userType=institution";
    }

    this.copyIFrameLink = "<iframe src="+ this.iFrameLink +" title=\"User Profile\" width=\"500\" height=\"500\"></iframe>";
    //this.projectList = this.user.projects;

    this.userId = this.user.id;
    console.log(JSON.stringify(this.userId));

    if (this.isIndividual) {
      await this.userService.getBadges({ id: this.userId }).toPromise().then(
        response => {
          this.badges = response.data.badges;
        }
      );

      await this.userService.getCurrentProjects({ id: this.userId }).toPromise().then(
        response => {
          this.currentProj = response.data.currProjects;
        }
      );

      await this.userService.getPastProjects({ id: this.userId }).toPromise().then(
        response => {
          this.pastProj = response.data.pastProjects;
        }
      );

      await this.resourceService.getUserKnowledge({ id: this.userId }).toPromise().then(
        response => {
          this.knowledge = response.data.knowledges;
        }
      );

      await this.resourceService.getUserItem({ id: this.userId }).toPromise().then(
        response => {
          this.item = response.data.items;
          this.resourceOffers = this.resourceOffers.concat(response.data.items);
        }
      );

      await this.resourceService.getUserManpower({ id: this.userId }).toPromise().then(
        response => {
          this.manpower = response.data.manpowers;
          this.resourceOffers = this.resourceOffers.concat(response.data.manpowers);
        }
      );

      await this.resourceService.getUserVenue({ id: this.userId }).toPromise().then(
        response => {
          this.venue = response.data.venues;
          this.resourceOffers = this.resourceOffers.concat(response.data.venues);
        }
      );

      await this.userService.getUserAffiliations({id: this.userId}).toPromise().then(
        response => {
          this.indAffiliations = response.data.affiliations;
        }
      )

    } else {
      await this.institutionService.getCurrentProjects({ id: this.userId }).toPromise().then(
        response => {
          this.currentProj = response.data.currProjects;
        }
      );

      await this.institutionService.getPastInvolvement({ id: this.userId }).toPromise().then(
        response => {
          this.pastProj = response.data.pastProjects;
        }
      );

      await this.resourceService.getInstitutionKnowledge({ id: this.userId }).toPromise().then(
        response => {
          this.knowledge = response.data.knowledges;
        }
      );

      await this.resourceService.getInstitutionItem({ id: this.userId }).toPromise().then(
        response => {
          this.item = response.data.items;
          this.resourceOffers = this.resourceOffers.concat(response.data.items);
        }
      );

      await this.resourceService.getInstitutionVenue({ id: this.userId }).toPromise().then(
        response => {
          this.venue = response.data.venues;
          this.resourceOffers = this.resourceOffers.concat(response.data.venues);
        }
      );
    }

    this.resourceOffers.sort(this.sortFunction);

    console.log("BADGES: "+this.badges);
    console.log("CURR PROJ: "+this.currentProj);
    console.log("PAST PROJ: " + this.pastProj);
    console.log("KNO: " + this.knowledge);
    console.log("MPW: " + this.manpower);
    console.log("ITEM: " + this.item);
    console.log("VENUE: " + this.venue);
    console.log("RES OFFERS: " + JSON.stringify(this.resourceOffers));
  }

  sortFunction(a, b) {
    var dateA = new Date(a.updatedAt).getTime();
    console.log("DATE A" + dateA);
    var dateB = new Date(b.updatedAt).getTime();
    return dateA > dateB ? -1 : 1;
  }

  copied(): void {
    alert("Copied!");
  }

}
