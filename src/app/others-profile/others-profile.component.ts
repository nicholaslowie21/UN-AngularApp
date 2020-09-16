import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { InstitutionService } from '../services/institution.service';

@Component({
  selector: 'app-others-profile',
  templateUrl: './others-profile.component.html',
  styleUrls: ['./others-profile.component.css']
})
export class OthersProfileComponent implements OnInit {

  username: string;
  userType: string;
  user: any;
  isIndividual = false;
  isVerified = false;

  constructor(private route: ActivatedRoute, private userService: UserService, private institutionService: InstitutionService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.username = params.username;
        this.userType = params.userType;
      }
    )
    
    if(this.userType == "user") {
      this.isIndividual = true;
      this.userService.viewUserProfile({username: this.username}).subscribe(
        response => {
          this.user = response.data.targetUser;
          if(this.user.isVerified == "true") {
            this.isVerified = true;
          }
        }
      )
    } else {
      this.isIndividual = false;
      this.institutionService.viewInstitutionProfile({username: this.username}).subscribe(
        response => {
          this.user = response.data.targetInstitution;
          if(this.user.isVerified) {
            this.isVerified = true;
          }
        }
      )
    }
  }

}
