import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

import { SafePipe } from '../safe.pipe';

@Component({
  selector: 'app-own-profile',
  templateUrl: './own-profile.component.html',
  styleUrls: ['./own-profile.component.css']
})
export class OwnProfileComponent implements OnInit {

  user: any;
  isIndividual = false;
  shareLink = '';
  //projectList = Array;

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    this.shareLink = "http://localhost:4200/profile?userId"+this.user.id;
    if (this.tokenStorageService.getAccountType() == "user") {
      this.isIndividual = true;
    }
    //this.projectList = this.user.projects;
  }

}
