import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { InstitutionService } from '../services/institution.service';
import { TokenStorageService } from '../services/token-storage.service';
import { MessageService } from 'primeng/api/';

@Component({
  selector: 'app-others-profile',
  templateUrl: './others-profile.component.html',
  styleUrls: ['./others-profile.component.css'],
  providers: [MessageService]
})
export class OthersProfileComponent implements OnInit {

  username: string;
  userType: string;
  user: any;
  isIndividual = false;
  isVerified = false;
  id: any;
  isLoggedIn = false;
  indAffiliations: any;
  status: any;
  isUnclaimed = false;
  form: any = {};
  file: any;
  type: any;
  claimSuccess = false;

  constructor(private route: ActivatedRoute, private userService: UserService, private institutionService: InstitutionService,
     private tokenStorageService: TokenStorageService, private messageService: MessageService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.userType = params.userType;
        this.id = params.id;
      }
    )

    if(this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
    }
    
    if(this.userType == "individual") {
      this.isIndividual = true;
      this.userService.viewUserById({id: this.id}).subscribe(
        response => {
          this.user = response.data.targetUser;
          this.status = this.user.status;
          if(this.status == "unclaimed") {
            this.isUnclaimed = true;
          }
          if(this.user.isVerified == "true") {
            this.isVerified = true;
          }
        }
      )
      await this.userService.getUserAffiliations({id: this.id}).toPromise().then(
        response => {
          this.indAffiliations = response.data.affiliations;
        }
      );
    } else {
      this.isIndividual = false;
      this.institutionService.viewInstitutionById({id: this.id}).subscribe(
        response => {
          this.user = response.data.targetInstitution;
          this.status = this.user.status;
          if(this.status == "unclaimed") {
            this.isUnclaimed = true;
          }
          if(this.user.isVerified) {
            this.isVerified = true;
          }
        }
      )
    }
    console.log("others profile: "+this.user);
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file = file;
    }
  }

  onSubmit(): void {
    if (this.file == null) {
      this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:'Choose a file!'});
      return;
    }

    if(this.form.password !== this.form.confirmPassword) {
      this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:'Your password and confirm password do not match!'});
      return;
    }

    if(this.userType == "individual") {
      this.type = "user";
    } else {
      this.type = "institution"
    }

    const formData = new FormData();
    formData.append("username", this.form.username);
    formData.append("email", this.form.email);
    formData.append("password", this.form.password);
    formData.append("accountType", this.type);
    formData.append("verifyFile", this.file);
    formData.append("accountId", this.id);

    this.userService.claimAccount(formData).subscribe(
      response => {
        console.log(response);
        this.claimSuccess = true;
      },
      err => {
        this.claimSuccess = false;
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        console.log(err);
      }
    );
  }

}
