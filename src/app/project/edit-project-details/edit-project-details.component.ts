import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-edit-project-details',
  templateUrl: './edit-project-details.component.html',
  styleUrls: ['./edit-project-details.component.css']
})
export class EditProjectDetailsComponent implements OnInit {

  projectId: any;
  project: any;

  loggedInUser: any;
  isHostAdmin = false;

  countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre and Miquelon", "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent And The Grenadines", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

  SDGs = ['1. No Poverty', '2. Zero Hunger', '3. Good Health and Well-Being',
    '4. Quality Education', '5. Gender Equality', '6. Clean Water and Sanitation',
    '7. Affordable and Clean Energy', '8. Decent Work and Economic Growth',
    '9. Industry, Innovation, and Infrastructure', '10. Reduced Inequalities',
    '11. Sustainable Cities and Communities', '12. Responsible Consumption and Production',
    '13. Climate Action', '14. Life Below Water', '15. Life on Land',
    '16. Peace, Justice, and Strong Institutions', '17. Partnerships'];
  SDGsMap = [];
  SDGsChecked = [];

  isUpdateSuccessful = false;
  errorMessage = '';

  image: any;
  isUploadPicSuccessful = false;
  errorMsgUploadPic = '';
  imgString: any;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private tokenStorageService: TokenStorageService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.projectId = params.id;
      }
    );

    this.loggedInUser = this.tokenStorageService.getUser();

    console.log(this.projectId);
    await this.projectService.viewProject({ id: this.projectId }).toPromise().then(
      response => {
        this.project = response.data.targetProject;
        console.log(JSON.stringify(this.project));
        this.imgString = "https://localhost:8080" + this.project.imgPath;
        console.log(this.imgString);
      },
      err => {
        alert(err.error.msg);
      }
    );

    if(this.project.host == this.loggedInUser.id) {
      this.isHostAdmin = true;
    }
    for(var i=0; i<this.project.admins.length; i++) {
      if(this.project.admins[i] == this.loggedInUser.id) {
        this.isHostAdmin = true;
        break;
      }
    }

    for (var x = 0; x < this.SDGs.length; x++) {
      if (this.project.SDGs.includes(x + 1)) {
        this.SDGsMap[x] = true;
      } else {
        this.SDGsMap[x] = false;
      }
    }
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
      console.log(this.image);
    }
  }

  onSubmitImage(): void {
    if (this.image == null) {
      this.errorMsgUploadPic = 'Choose a file!';
      this.isUploadPicSuccessful = false;
      return;
    }

    const formData = new FormData();
    formData.append('projectId', this.projectId);
    formData.append('projectPic', this.image);
    
    console.log(formData);

    this.projectService.uploadProjectPicture(formData).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.isUploadPicSuccessful = true;
        window.location.reload();
      },
      err => {
        this.errorMsgUploadPic = err.error.msg;
        this.isUploadPicSuccessful = false;
      }
    );

  }

  updateCheckedSDGs(x, event) {
    this.SDGsMap[x] = event.target.checked;
    console.log(x);
  }

  updateSDGs() {
    for (var x in this.SDGsMap) {
      if (this.SDGsMap[x]) {
        this.SDGsChecked.push(parseInt(x) + 1);
      }
    }
  }

  onSubmit(): void {
    this.updateSDGs();
    console.log(this.SDGsChecked);
    const form = {
      id: this.projectId,
      title: this.project.title,
      desc: this.project.desc,
      country: this.project.country,
      rating: this.project.rating,
      SDGs: this.SDGsChecked
    }

    this.projectService.updateProject(form).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.isUpdateSuccessful = true;
        //alert("Project updated!");
      },
      err => {
        this.errorMessage = err.error.msg;
        this.isUpdateSuccessful = false;
      }
    );

  }
}
