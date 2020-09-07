import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  isLoggedIn = false;
  user: any;
  isUpdateSuccessful = false;
  errorMessage = '';

  image: any;
  isUploadPicSuccessful = false;
  errorMsgUploadPic = '';

  constructor(private userService: UserService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.user = this.tokenStorage.getUser();
    }
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }

  onSubmitImage(): void {
    if (this.image == null) {
      this.errorMsgUploadPic = 'Choose a file!';
      this.isUploadPicSuccessful = false;
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', this.image);

    this.userService.uploadProfilePicture(formData).subscribe(
      response => {
        this.tokenStorage.saveUser(response.data.user);
        this.isUploadPicSuccessful = true;
        this.reloadPage();
      },
      err => {
        this.errorMsgUploadPic = err.error.msg;
        this.isUploadPicSuccessful = false;
      }
    )
  }

  onSubmit(): void {
    const formUpdateProfile = {
      name: this.user.name,
      occupation: this.user.occupation,
      bio: this.user.bio,
      country: this.user.country
    }
    this.userService.updateProfile(formUpdateProfile).subscribe(
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

  reloadPage(): void {
    window.location.reload();
  }

}
