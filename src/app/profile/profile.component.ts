import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  form: any = {};
  isUpdateSuccessful = false;
  errorMessage = '';

  constructor(private userService: UserService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.userService.updateProfile(this.form).subscribe(
      response => {
        this.tokenStorage.saveUser(response.data.user);

        this.isUpdateSuccessful = true;
      },
      err => {
        this.errorMessage = err.error.msg;
        this.isUpdateSuccessful = false;
      }
    )
  }

}
