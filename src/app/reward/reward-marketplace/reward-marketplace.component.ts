import { Component, OnInit } from '@angular/core';
import { RewardService } from '../../services/reward.service';

@Component({
  selector: 'app-reward-marketplace',
  templateUrl: './reward-marketplace.component.html',
  styleUrls: ['./reward-marketplace.component.css']
})
export class RewardMarketplaceComponent implements OnInit {

  rewards: any[];
  currentReward: any = {rewardImg: ''};

  sortOptions: any = [];
  sortOrder: number;
  sortField: string;
  sortKey = '';

  countries = ["All","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  countryOptions = [];
  filterKeyCountry = '';

  constructor(private rewardService: RewardService) { }

  async ngOnInit() {
    await this.rewardService.getRewardMarketplace().toPromise().then(
      res => this.rewards = res.data.rewards
    );
    console.log(this.rewards);

    this.sortOptions = [
      {label: 'Date Newest to Oldest', value: '!endDate'},
      {label: 'Date Oldest to Newest', value: 'endDate'}
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
    if(value == 'All') {
      arr = this.rewards;
    } else {
      for(let i = 0; i < this.rewards.length; i++) {
        if(this.rewards[i].country == value) {
          arr.push(this.rewards[i]);
        }
      }
    }
    
    this.rewards = arr;
    this.sortKey = '';
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
      endDate: reward.endDate.substring(0, 10),
      rewardImg: reward.imgPath,
      claimedNum: reward.claimedNum,
      remaining: 0,
      status: reward.status,
      sponsorId: reward.sponsorId,
      sponsorType: reward.sponsorType,
      accountName: reward.accountName,
      accountUsername: reward.accountUsername
    };
    this.currentReward.remaining = this.currentReward.quota - this.currentReward.claimedNum
    console.log(this.currentReward);
  }

}
