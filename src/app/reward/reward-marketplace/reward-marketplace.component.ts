import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RewardService } from '../../services/reward.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reward-marketplace',
  templateUrl: './reward-marketplace.component.html',
  styleUrls: ['./reward-marketplace.component.css'],
  providers: [MessageService]
})
export class RewardMarketplaceComponent implements OnInit {

  rewards: any[];
  currentReward: any = {rewardImg: ''};
  userType: any;
  userTier: any;
  wallet: 0;

  isRedeemSuccessful: boolean = false;

  sortOptions: any = [];
  sortOrder: number;
  sortField: string;
  sortKey = '';

  countries = ["All","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  countryOptions = [];
  filterKeyCountry = '';
  tierOptions = [];
  filterKeyMinTier = '';

  constructor(private messageService: MessageService, private rewardService: RewardService, private tokenStorageService: TokenStorageService, private userService: UserService) { }

  async ngOnInit() {
    await this.rewardService.getRewardMarketplace().toPromise().then(
      res => this.rewards = res.data.rewards
    );
    console.log(this.rewards[0]);

    this.userType = this.tokenStorageService.getAccountType(); 
    if (this.userType == 'user') {
      await this.userService.viewUserProfile({username: this.tokenStorageService.getUser().username}).toPromise().then(
        response => {
          this.wallet = response.data.targetUser.wallet;
          this.userTier = response.data.targetUser.tier;
        }
      )
    }

    this.sortOptions = [
      {label: 'Date Latest to Soonest', value: '!endDate'},
      {label: 'Date Soonest to Latest', value: 'endDate'}
    ];

    this.tierOptions = [
      {label: 'All', value: 'all'},
      {label: 'Bronze', value: 'bronze'},
      {label: 'Silver', value: 'silver'},
      {label: 'Gold', value: 'gold'}
    ];

    for (let i = 0; i < this.countries.length; i++) {
      this.countryOptions.push({label: this.countries[i], value: this.countries[i]});
    }
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  onSortChange(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
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
    this.sortKey = '';

    let arr2 = [];
    if(this.filterKeyMinTier.length > 0) {
      if(this.filterKeyMinTier == 'all') {
        arr2 = this.rewards;
      } else {
        for(var m = 0; m < this.rewards.length; m++) {
          if(this.rewards[m].minTier == this.filterKeyMinTier) {
            arr2.push(this.rewards[m]);
          }
        }
      }
      this.rewards = arr2;
    }
  }

  async filterTier(event) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    if (value == 'all') {
      arr = this.rewards;
    } else {
      for (let i = 0; i < this.rewards.length; i++) {
        if (this.rewards[i].minTier == value) {
          arr.push(this.rewards[i]);
        }
      }
    }
    
    this.rewards = arr;
    this.sortKey = '';
    
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

  setCurrentReward(reward): void {
    this.currentReward = {
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
      claimedNum: reward.claimedNum,
      remaining: 0,
      status: reward.status,
      sponsorId: reward.sponsorId,
      sponsorType: reward.sponsorType,
      accountName: reward.accountName,
      accountUsername: reward.accountUsername,
      accountImgPath: reward.accountImgPath,
      externalName: reward.externalName
    };
    this.currentReward.remaining = this.currentReward.quota - this.currentReward.claimedNum;
    console.log(this.currentReward);
  }

  redeemReward(rewardId): void {
    let r = confirm("Are you sure you want to redeem this reward?");
    if (r == true) {
      this.rewardService.redeemReward({id: rewardId}).subscribe(
        response => {
          this.isRedeemSuccessful = true;
          this.ngOnInit();
        }, 
        err => {
          console.log(err);
          this.messageService.add({key:'toastMsg', severity:'error', summary:'Error', detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

}
