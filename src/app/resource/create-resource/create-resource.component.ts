import { Component, OnInit } from '@angular/core';
import { PaidResourceService } from '../../services/paid-resource.service';
import { ResourceService } from '../../services/resource.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-create-resource',
  templateUrl: './create-resource.component.html',
  styleUrls: ['./create-resource.component.css']
})
export class CreateResourceComponent implements OnInit {

  form: any = {};
  user: any;
  userType: any;
  isPaid = false;
  isSuccessful = false;
  createFailed = false;
  errorMessage = '';
  resourceType = '';
  knowType = '';
  currentCountry = '';
  toBeAdded: FileList;
  attachment: any;

  newId: any;

  todayDate = new Date();
  
  countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (British)","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

  constructor(private paidResourceService: PaidResourceService, private resourceService: ResourceService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()) {
      this.user = this.tokenStorage.getUser();
      if(this.tokenStorage.getAccountType() == 'user') {
        this.userType = 'individual';
      } else {
        this.userType = 'institution';
      }
    }
    // by default, set the country option of the resource to that of the user
    this.currentCountry = this.user.country;
  }

  updateFree(event) {
    if (event.target.checked) {
      this.isPaid = false;
    }
  }

  updatePaid(event) {
    if (event.target.checked) {
      this.isPaid = true;
    }
  }

  // when user updates the country of the resource to one that may be different from their own
  updateCountry(event) {
    this.currentCountry = event.target.value;
  }

  selectImages(event): void {
    this.toBeAdded = event.target.files;
  }

  selectAttachment(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.attachment = file;
    }
  }

  onSubmit(): void {
    if(this.toBeAdded != undefined) {
      if(this.toBeAdded.length > 10) {
        this.errorMessage = "You can only upload up to 10 images";
        this.createFailed = true;
        return;
      }
    } 

    const formData = new FormData();
    formData.append("title", this.form.title);
    formData.append("desc", this.form.desc);

    if(this.toBeAdded != undefined) {
      for (let i = 0; i < this.toBeAdded.length; i++) {
        if (this.isPaid) {
          formData.append("paidResourcesPics", this.toBeAdded[i]);
        } else {
          if (this.resourceType == 'Item') {
            formData.append("itemPics", this.toBeAdded[i]);
          } else if (this.resourceType == 'Venue') {
            formData.append("venuePics", this.toBeAdded[i]);
          }
        }
      }
    }

    if (this.isPaid) {
      formData.append("category", this.form.category);
      formData.append("country", this.currentCountry);
      formData.append("price", this.form.price);
      this.paidResourceService.createPaidResource(formData).subscribe(
        response => {
          this.newId = response.data.paidresource.id;
          this.isSuccessful = true;
          this.createFailed = false;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.createFailed = true;
        }
      );
    } else {
      if (this.resourceType == 'Item') {
        // set country
        formData.append("country", this.currentCountry);
        this.resourceService.createItem(formData).subscribe(
          response => {
            this.newId = response.data.item.id;
            this.isSuccessful = true;
            this.createFailed = false;
          },
          err => {
            this.errorMessage = err.error.msg;
            this.createFailed = true;
          }
        );
      } else if (this.resourceType == 'Knowledge') {
        formData.append('link', this.form.link || '');
        formData.append("attachment", this.attachment || '');
        if (this.knowType == 'Patent') {
          formData.append('knowType', 'patent');
          formData.append('patentNum', this.form.patentNum);
          formData.append('expiry', this.form.expiry);
          formData.append('issn', '');
          formData.append('doi', '');
          formData.append('issueDate', '');
        } else if (this.knowType == 'Publication') {
          formData.append('knowType', 'publication');
          formData.append('patentNum', '');
          formData.append('expiry', '');
          formData.append('issn', this.form.issn || '');
          formData.append('doi', this.form.doi || '');
          formData.append('issueDate', this.form.issueDate || '');
        } else {
          formData.append('knowType', 'other');
          formData.append('patentNum', '');
          formData.append('expiry', '');
          formData.append('issn', '');
          formData.append('doi', '');
          formData.append('issueDate', '');
        }
        console.log(formData);
        this.resourceService.createKnowledge(formData).subscribe(
          response => {
            this.isSuccessful = true;
            this.createFailed = false;
            this.newId = response.data.knowledge.id;
          },
          err => {
            this.errorMessage = err.error.msg;
            this.createFailed = true;
          }
        );
      } else if (this.resourceType == 'Manpower') {
        this.resourceService.createManpower(this.form).subscribe(
          response => {
            this.isSuccessful = true;
            this.createFailed = false;
            this.newId = response.data.manpower.id;
          },
          err => {
            this.errorMessage = err.error.msg;
            this.createFailed = true;
          }
        );
      } else if (this.resourceType == 'Venue') {
        // set country
        formData.append("country", this.currentCountry);
        formData.append("address", this.form.address);
        this.resourceService.createVenue(formData).subscribe(
          response => {
            this.isSuccessful = true;
            this.createFailed = false;
            this.newId = response.data.venue.id;
          },
          err => {
            this.errorMessage = err.error.msg;
            this.createFailed = true;
          }
        );
      }
    }
  }

  getLink() {
    if (this.isPaid) {
      return "/resource/paid/details?id=" + this.newId;
    } else {
      return "/resource/resourceDetails?id=" + this.newId + "&type=" + this.resourceType.toLowerCase();
    }
  }
}