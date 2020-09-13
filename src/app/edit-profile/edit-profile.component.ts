import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { InstitutionService } from '../services/institution.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  isLoggedIn = false;
  user: any;
  userSkills: any;
  isIndividual = false;
  isUpdateSuccessful = false;
  errorMessage = '';

  image: any;
  isUploadPicSuccessful = false;
  errorMsgUploadPic = '';

  SDGs = ['1. No Poverty', '2. Zero Hunger', '3. Good Health and Well-Being',
          '4. Quality Education', '5. Gender Equality', '6. Clean Water and Sanitation',
          '7. Affordable and Clean Energy', '8. Decent Work and Economic Growth',
          '9. Industry, Innovation, and Infrastructure', '10. Reduced Inequalities',
          '11. Sustainable Cities and Communities', '12. Responsible Consumption and Production',
          '13. Climate Action', '14. Life Below Water', '15. Life on Land',
          '16. Peace, Justice, and Strong Institutions', '17. Partnerships'];
  SDGsMap = [];
  SDGsChecked = [];

  constructor(private userService: UserService, private institutionService: InstitutionService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.user = this.tokenStorage.getUser();
      if (this.tokenStorage.getAccountType() == "user") {
        this.isIndividual = true;
        this.userSkills = this.user.skills.toString();
      }
    }

    for (var x=0; x<this.SDGs.length; x++) {
      if (this.user.SDGs.includes(x+1)) {
        this.SDGsMap[x] = true;
      } else {
        this.SDGsMap[x] = false;
      }
    }
  }

  updateCheckedSDGs(x, event) {
    this.SDGsMap[x] = event.target.checked;
  }

  updateSDGs() {
    for (var x in this.SDGsMap) {
      if(this.SDGsMap[x]) {
        this.SDGsChecked.push(parseInt(x)+1);
      }
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

    if (this.isIndividual) {
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
    } else {
      this.institutionService.uploadProfilePicture(formData).subscribe(
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
    
  }

  onSubmit(): void {
    this.updateSDGs();
    if (this.isIndividual) {
      const skillsArr = this.userSkills.split(",");
      const formUpdateProfile = {
        name: this.user.name,
        occupation: this.user.occupation,
        bio: this.user.bio,
        country: this.user.country,
        website: this.user.website || "",
        gender: this.user.gender,
        SDGs: this.SDGsChecked,
        skills: skillsArr
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
    } else {
      const formUpdateProfile = {
        name: this.user.name,
        address: this.user.address,
        bio: this.user.bio,
        country: this.user.country,
        website: this.user.website || "",
        phone: this.user.phone,
        SDGs: this.SDGsChecked,
      }
      this.institutionService.updateProfile(formUpdateProfile).subscribe(
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

  reloadPage(): void {
    window.location.reload();
  }

}
