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

  countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

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
    console.log(x);
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
    console.log(this.SDGsChecked);
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
          this.SDGsChecked = [];
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
          this.SDGsChecked = [];
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
