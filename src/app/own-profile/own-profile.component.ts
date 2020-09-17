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

@Component({
  selector: 'app-own-profile',
  templateUrl: './own-profile.component.html',
  styleUrls: ['./own-profile.component.css']
})
export class OwnProfileComponent implements OnInit {

  user: any;
  isIndividual = false;
  isVerified = false;
  usernameFormatted = '';
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
  // iFrameLink = ""+"<iframe src="this.shareLink" title="User Profile"></iframe>"
  badges: any;
  userId: any;

  currentProj: any;
  pastProj: any;

  knowledge: any;
  manpower: any;
  item: any;
  venue: any;
  //projectList = Array;

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService, private userService: UserService,
  private resourceService: ResourceService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    for (var i = 0; i < this.user.username.length; i++) {
      if (this.user.username.charAt(i) == ' ') {
        this.usernameFormatted = this.usernameFormatted.concat('%20');
      } else {
        this.usernameFormatted = this.usernameFormatted.concat(this.user.username.charAt(i));
      }
    }
    this.shareLink = "http://localhost:4200/profile?username=" + this.usernameFormatted;
    if (this.tokenStorageService.getAccountType() == "user") {
      this.isIndividual = true;
      if(this.user.isVerified == "true") {
        this.isVerified = true;
      }
      this.shareLink += "&userType=individual";
    } else {
      if(this.user.isVerified) {
        this.isVerified = true;
      }
      this.shareLink += "&userType=institution";
    }
    //this.projectList = this.user.projects;

    this.userId = this.user.id;
    console.log(JSON.stringify(this.userId));
    console.log(JSON.stringify(this.user.badges));
    this.userService.getBadges({ id: this.userId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.badges = response.data.badges;
      }
    );

    this.userService.getCurrentProjects({ id: this.userId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.currentProj = response.data.currProjects;
        console.log(JSON.stringify(this.currentProj));
      }
    );

    this.userService.getPastProjects({ id: this.userId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.pastProj = response.data.pastProjects;
        console.log(JSON.stringify(this.pastProj));
      }
    );

    this.resourceService.getUserKnowledge({ id: this.userId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.knowledge = response.data.knowledges;
        console.log(JSON.stringify(this.knowledge));
      }
    );

    this.resourceService.getUserItem({ id: this.userId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.item = response.data.items;
        console.log(JSON.stringify(this.item));
      }
    );

    this.resourceService.getUserManpower({ id: this.userId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.manpower = response.data.manpowers;
        console.log(JSON.stringify(this.manpower));
      }
    );

    this.resourceService.getUserVenue({ id: this.userId }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.venue = response.data.venues;
        console.log(JSON.stringify(this.venue));
      }
    );
  }

}
