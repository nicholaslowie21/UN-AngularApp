import { Component, OnInit } from '@angular/core';
import { RewardService } from '../../services/reward.service';
import { MessageService } from 'primeng/api';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-reward-offering',
  templateUrl: './reward-offering.component.html',
  styleUrls: ['./reward-offering.component.css'],
  providers: [MessageService]
})
export class RewardOfferingComponent implements OnInit {

  userType: any;

  rewards = [];
  sortOrder: number;
  sortField: string;
  filterKeyStatus = '';
  filterStatusOptions = [];

  editForm: any = {rewardImg: ''};

  countries = ["All","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  countryOptions = [];
  filterKeyCountry = '';

  constructor(private rewardService: RewardService, private messageService: MessageService, private tokenStorageService: TokenStorageService) { }

  async ngOnInit() {
    this.userType = this.tokenStorageService.getAccountType();
    
    await this.rewardService.getRewardOfferings().toPromise().then(
      res => this.rewards = res.data.rewards
    );
    console.log(this.rewards);

    this.filterStatusOptions = [
      { label: 'All', value: 'all' },
      { label: 'Pending', value: 'pending' },
      { label: 'Accepted', value: 'accepted'},
      { label: 'Active', value: 'open' },
      { label: 'Expired', value: 'close' },
      { label: 'Rejected', value: 'rejected'}
    ]

    for (let i = 0; i < this.countries.length; i++) {
      this.countryOptions.push({label: this.countries[i], value: this.countries[i]});
    }
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  async filterStatus(event) {
    let value = event.value;
    let arr = [];
    await this.ngOnInit();
    if(value == 'all') {
      arr = this.rewards;
    } else {
      for(var i=0; i<this.rewards.length; i++) {
        if(this.rewards[i].status == value) {
          arr.push(this.rewards[i]);
        }
      }
    }

    this.rewards = arr;

    let arr2 = [];
    if(this.filterKeyCountry.length > 0) {
      if(this.filterKeyCountry == 'All') {
        arr2 = this.rewards;
      } else {
        for(var m = 0; m < this.rewards.length; m++) {
          if(this.rewards[m].country == this.filterKeyCountry) {
            arr2.push(this.rewards[m]);
          }
        }
      }
      this.rewards = arr2;
    }
  }

  async filterCountry(event) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    if (value == 'All') {
      arr = this.rewards;
    } else {
      for (let i = 0; i < this.rewards.length; i++) {
        if (this.rewards[i].country == value) {
          arr.push(this.rewards[i]);
        }
      }
    }
    
    this.rewards = arr;
    let arr2 = [];
    if(this.filterKeyStatus.length > 0) {
      if(this.filterKeyStatus == 'all') {
        arr2 = this.rewards;
      } else {
        for(var m = 0; m < this.rewards.length; m++) {
          if(this.rewards[m].status == this.filterKeyStatus) {
            arr2.push(this.rewards[m]);
          }
        }
      }
      this.rewards = arr2;
    }
  }

  getForm(reward): void {
    this.editForm = {
      id: reward.id,
      title: reward.title,
      desc: reward.desc,
      country: reward.country,
      point: reward.point,
      quota: reward.quota,
      minTier: reward.minTier,
      startDate: reward.startDate.substring(0, 10),
      endDate: reward.endDate.substring(0, 10),
      rewardImg: reward.imgPath,
      createdAt: reward.createdAt,
      verifyFile: reward.verifyFile,
      claimedNum: reward.claimedNum,
      status: reward.status
    }
  }

  cancelReward(rewId): any {
    let r = confirm("Are you sure you want to cancel this reward offering?");
    if (r == true) {
      this.rewardService.cancelPendingRewardOffer({id: rewId}).subscribe(
        res => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Reward offering is cancelled!'});
          window.location.reload();
        }, err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
    
  }

}
