import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { InstitutionService } from '../services/institution.service';
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
  form: any = {};
  file: any;
  type: any;
  claimSuccess = false;

  constructor(private route: ActivatedRoute, private userService: UserService, private institutionService: InstitutionService,
    private messageService: MessageService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.userType = params.userType;
        this.id = params.id;
      }
    );
    
    if(this.userType == "individual") {
      this.isIndividual = true;
      await this.userService.viewUserById({id: this.id}).toPromise().then(
        response => {
          this.user = response.data.targetUser;
        }
      );
      if(this.user.isVerified == "true" || this.user.isVerified == true) {
        this.isVerified = true;
      }
    } else {
      this.isIndividual = false;
      await this.institutionService.viewInstitutionById({id: this.id}).toPromise().then(
        response => {
          this.user = response.data.targetInstitution;
        }
      );
      if(this.user.isVerified) {
        this.isVerified = true;
      }
    }
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
    console.log(this.id + " " + this.type + " " + this.file + " " + this.form.email + " " + this.form.password + " " + this.form.username);
    formData.append("accountId", this.id);
    formData.append("accountType", this.type);
    formData.append("verifyFile", this.file);
    formData.append("email", this.form.email);
    formData.append("password", this.form.password);
    formData.append("username", this.form.username);
    
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
