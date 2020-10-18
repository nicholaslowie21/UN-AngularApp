import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RewardService } from '../../services/reward.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-create-reward',
  templateUrl: './create-reward.component.html',
  styleUrls: ['./create-reward.component.css'],
  providers: [MessageService]
})
export class CreateRewardComponent implements OnInit {
 
  isVerified = false;
  isSuccessful = false;
  form: any = {};
  file: any;
  fileVerify: any;
  currentCountry: any;
  countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  minimumDate = new Date();

  constructor(private rewardService: RewardService, private tokenStorageService: TokenStorageService, private messageService: MessageService) { }

  ngOnInit() {
    let user = this.tokenStorageService.getUser();
    if(user.isVerified == 'true' || user.isVerified == true) {
      this.isVerified = true;
    } else {
      this.isVerified = false;
    }
    console.log(this.isVerified);
    this.currentCountry = this.tokenStorageService.getUser().country;  
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file = file;
    }
  }

  selectFileVerify(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileVerify = file;
    }
  }

  onSubmit(): void {
    console.log(this.file)
    console.log(this.form);

    const formData = new FormData();
    formData.append("title", this.form.title);
    formData.append("desc", this.form.desc || '');
    formData.append("country", this.currentCountry);
    formData.append("point", this.form.point);
    formData.append("quota", this.form.quota);
    formData.append("minTier", this.form.tier);
    formData.append("rewardImg", this.file || '');
    formData.append("endDate", this.form.date);
    formData.append("rewardFile", this.fileVerify);

    this.rewardService.createReward(formData).subscribe(
      res => {
        // this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Reward offering created!' });
        this.isSuccessful = true;
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
      }
    )
  }
}
