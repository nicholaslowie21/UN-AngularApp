import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  user: any;
  accountType: any;
  currPassword = '';
  newPassword = '';
  confirmPassword = '';
  isUsernameSuccessful = false;
  isPassSuccessful = false;
  isEmailSuccessful = false;  
  errMsgUsername = '';
  errMsgPass = '';
  errMsgEmail = '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()) {
      this.user = this.tokenStorage.getUser();
      this.accountType = this.tokenStorage.getAccountType();
    }
  }

  changePassword(): void {
    if(this.currPassword != this.user.password) {
      this.errMsgPass = 'Current password mismatch!'
      this.isPassSuccessful = false;
      return;
    }

    if(this.newPassword != this.confirmPassword) {
      this.errMsgPass = 'Your new password and confirm new password do not match!'
      this.isPassSuccessful = false;
      return;
    }

    if (this.accountType == "user") {
      this.authService.changePasswordUser({password: this.user.password}).subscribe(
        response => {
          this.tokenStorage.saveUser(response.data.user);
          this.isPassSuccessful = true;
        },
        err => {
          this.errMsgPass.concat(err.error.msg);
          this.isPassSuccessful = false;
        }
      )
    } else {
      this.authService.changePasswordInstitution({password: this.user.password}).subscribe(
        response => {
          this.tokenStorage.saveUser(response.data.user);
          this.isPassSuccessful = true;
        },
        err => {
          this.errMsgPass.concat(err.error.msg);
          this.isPassSuccessful = false;
        }
      )
    }
  }

  updateUsername(): void {
    this.userService.updateUsername({username: this.user.username}).subscribe(
      response => {
        this.tokenStorage.saveUser(response.data.user);
        this.isUsernameSuccessful = true;
      },
      err => {
        this.errMsgUsername.concat(err.error.msg);
        this.isUsernameSuccessful = false;
      }
    )
  }

  updateEmail(): void {
    this.userService.updateEmail({email: this.user.email}).subscribe(
      response => {
        this.tokenStorage.saveUser(response.data.user);
        this.isEmailSuccessful = true;
      },
      err => {
        this.errMsgEmail.concat(err.error.msg);
        this.isEmailSuccessful = false;
      }
    )
  }

}
