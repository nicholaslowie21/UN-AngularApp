import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram';

@Component({
  selector: 'app-own-profile',
  templateUrl: './own-profile.component.html',
  styleUrls: ['./own-profile.component.css']
})
export class OwnProfileComponent implements OnInit {

  user: any;
  isIndividual = false;
  usernameFormatted = '';
  shareLink = '';
  faFacebookSquare = faFacebookSquare;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faWhatsapp = faWhatsapp;
  faTelegram = faTelegram;
  //projectList = Array;

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    for(var i=0; i<this.user.username.length; i++) {
      if(this.user.username.charAt(i)==' ') {
        this.usernameFormatted = this.usernameFormatted.concat('%20');
      } else {
        this.usernameFormatted = this.usernameFormatted.concat(this.user.username.charAt(i));
      }
    }
    this.shareLink = "http://localhost:4200/profile?username="+this.usernameFormatted;
    if (this.tokenStorageService.getAccountType() == "user") {
      this.isIndividual = true;
    }
    //this.projectList = this.user.projects;
  }

}
