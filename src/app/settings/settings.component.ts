import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { InstitutionService } from '../services/institution.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  user: any;
  isIndividual: any;
  notVerified: any;
  pendingVerified: any;
  verified: any;

  isPassSuccessful = false;
  errMsgPass = '';

  isUsernameSuccessful = false;
  errMsgUsername = '';
  
  isEmailSuccessful = false;  
  errMsgEmail = '';

  image: any;
  verifyRequest: any = {};
  isRequestSuccessful = false;
  isSubmitted = false;
  errMsgVerifyRequest = '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, 
    private userService: UserService, private institutionService: InstitutionService) { }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()) {
      this.user = this.tokenStorage.getUser();
      if (this.tokenStorage.getAccountType() == "user") {
        this.isIndividual = true;
        if (this.user.isVerified == "false" || this.user.isVerified == false) {
          this.notVerified = true;
        } else if (this.user.isVerified == "pending") {
          this.pendingVerified = true;
        } else {
          this.verified = true;
        }
      }
    }
  }

  changePassword(form: NgForm): void {
    if(form.value.newPassword != form.value.confirmPassword) {
      this.errMsgPass = 'Your new password and confirm new password do not match!'
      this.isPassSuccessful = false;
      return;
    }

    if (this.isIndividual) {
      this.authService.changePasswordUser(form.value).subscribe(
        response => {
          this.tokenStorage.saveUser(response.data.user);
          this.isPassSuccessful = true;
          form.reset();
        },
        err => {
          this.errMsgPass = err.error.msg;
          this.isPassSuccessful = false;
        }
      )
    } else {
      this.authService.changePasswordInstitution(form.value).subscribe(
        response => {
          this.tokenStorage.saveUser(response.data.user);
          this.isPassSuccessful = true;
        },
        err => {
          this.errMsgPass = err.error.msg;
          this.isPassSuccessful = false;
        }
      )
    }
  }

  // updateUsername(): void {
  //   if (this.isIndividual) {
  //     this.userService.updateUsername({username: this.user.username}).subscribe(
  //       response => {
  //         this.tokenStorage.saveUser(response.data.user);
  //         this.isUsernameSuccessful = true;
  //       },
  //       err => {
  //         this.errMsgUsername = err.error.msg;
  //         this.isUsernameSuccessful = false;
  //       }
  //     )
  //   } else {
  //     this.institutionService.updateUsername({username: this.user.username}).subscribe(
  //       response => {
  //         this.tokenStorage.saveUser(response.data.user);
  //         this.isUsernameSuccessful = true;
  //       },
  //       err => {
  //         this.errMsgUsername = err.error.msg;
  //         this.isUsernameSuccessful = false;
  //       }
  //     )
  //   }
  // }

  updateEmail(): void {
    if (this.isIndividual) {
      this.userService.updateEmail({email: this.user.email}).subscribe(
        response => {
          this.tokenStorage.saveUser(response.data.user);
          this.isEmailSuccessful = true;
        },
        err => {
          this.errMsgEmail = err.error.msg;
          this.isEmailSuccessful = false;
        }
      )
    } else {
      this.institutionService.updateEmail({email: this.user.email}).subscribe(
        response => {
          this.tokenStorage.saveUser(response.data.user);
          this.isEmailSuccessful = true;
        },
        err => {
          this.errMsgEmail = err.error.msg;
          this.isEmailSuccessful = false;
        }
      )
    }
    
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }

  requestVerification(): void {
    this.isSubmitted = true;
    if (this.image == null) {
      this.errMsgVerifyRequest = 'Upload your image!';
      this.isRequestSuccessful = false;
      return;
    }
    
    const formData = new FormData();
    formData.append('verifyPic', this.image);

    this.authService.requestVerification(formData).subscribe(
      response => {
        this.isRequestSuccessful = true;
        this.verifyRequest.status = response.data.verifyrequest.status;
        this.tokenStorage.saveUser(response.data.user);
      },
      err => {
        this.errMsgVerifyRequest = err.error.msg;
        this.isRequestSuccessful = false;
      }
    )
  }

}
