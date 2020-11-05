import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RewardService } from '../../services/reward.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-rewards',
  templateUrl: './my-rewards.component.html',
  styleUrls: ['./my-rewards.component.css'],
  providers: [MessageService]
})
export class MyRewardsComponent implements OnInit {

  activeVouchers: any[];
  claimedVouchers: any[];
  currentVoucher: any = {rewardImgPath: ''};

  userType: any;
  userTier: any;
  wallet: 0;

  isClaimSuccessful: boolean = false;

  sortOptions: any = [];
  sortOrder: number;
  sortField: string;
  sortKeyActive = '';
  sortKeyClaimed = '';

  countries = ["All","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  countryOptions = [];
  filterKeyCountryActive = '';
  filterKeyCountryClaimed = '';

  constructor(private messageService: MessageService, private rewardService: RewardService, private userService: UserService, private tokenStorageService: TokenStorageService) { }

  async ngOnInit() {
    await this.rewardService.getVouchers({status: 'active'}).toPromise().then(
      res => this.activeVouchers = res.data.vouchers
    );
    await this.rewardService.getVouchers({status: 'claimed'}).toPromise().then(
      res => this.claimedVouchers = res.data.vouchers
    );
    console.log(this.activeVouchers[0]);
    
    this.userType = this.tokenStorageService.getAccountType();
    if (this.userType == 'user') {
      await this.userService.viewUserProfile({username: this.tokenStorageService.getUser().username}).toPromise().then(
        response => {
          this.wallet = response.data.targetUser.wallet;
          this.userTier = response.data.targetUser.tier;
        }
      )
    }
    console.log(this.wallet);
    console.log(this.userTier);

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

  async filterCountryActive(event) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    if(value == 'All') {
      arr = this.activeVouchers;
    } else {
      for(let i = 0; i < this.activeVouchers.length; i++) {
        if(this.activeVouchers[i].rewardCountry == value) {
          arr.push(this.activeVouchers[i]);
        }
      }
    }
    
    this.activeVouchers = arr;
    this.sortKeyActive = '';
  }

  async filterCountryClaimed(event) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    if(value == 'All') {
      arr = this.claimedVouchers;
    } else {
      for(let i = 0; i < this.claimedVouchers.length; i++) {
        if(this.claimedVouchers[i].rewardCountry == value) {
          arr.push(this.activeVouchers[i]);
        }
      }
    }
    
    this.claimedVouchers = arr;
    this.sortKeyClaimed = '';
  }

  setCurrentVoucher(voucher): void {
    this.currentVoucher = {
      id: voucher.id,
      rewardId: voucher.rewardId,
      code: voucher.code,
      status: voucher.status,
      userId: voucher.userId,
      claimedAt: '',
      endDate: voucher.endDate.substring(0, 10),
      createdAt: voucher.createdAt.substring(0, 10),
      rewardTitle: voucher.rewardTitle,
      rewardDesc: voucher.rewardDesc,
      rewardImgPath: voucher.rewardImgPath,
      rewardCountry: voucher.rewardCountry      
    };
    if (voucher.status == 'claimed') {
      this.currentVoucher.claimedAt = voucher.claimedAt.substring(0, 10);
    }
    console.log(this.currentVoucher);
  }

  claimVoucher(voucherId): void {
    let r = confirm("Are you sure you want to claim this voucher?");
    if (r == true) {
      this.rewardService.claimVoucher({id: voucherId}).subscribe(
        response => {
          this.isClaimSuccessful = true;
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
