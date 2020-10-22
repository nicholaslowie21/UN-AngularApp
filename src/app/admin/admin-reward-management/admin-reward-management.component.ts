import { Component, OnInit } from '@angular/core';
import { RewardService } from '../../services/reward.service';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-admin-reward-management',
  templateUrl: './admin-reward-management.component.html',
  styleUrls: ['./admin-reward-management.component.css'],
  providers: [MessageService]
})
export class AdminRewardManagementComponent implements OnInit {

  pending = [];
  open = [];
  rejected = [];
  close = [];

  viewForm: any = {};
  attachmentPath: any;

  editForm: any = {rewardImg: '', accountImgPath: ''};
  file: any;
  minimumDate = new Date();
  isEdit = false;

  pp = 'pending';
  oo = 'open';
  rr = 'rejected';
  cc = 'close';
  countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  countryOptions = [];
  filterKeyCountry = '';
  filterKeyCountryOpen = '';
  filterKeyCountryRej = '';
  filterKeyCountryClose = '';

  sortField = '';
  sortOrder = '';

  constructor(private rewardService: RewardService, private messageService: MessageService) { }

  async ngOnInit() {
    await this.rewardService.getRewardOfferingReq({status: 'pending'}).toPromise().then(
      res => this.pending = res.data.rewards
    )
    console.log(this.pending)

    await this.rewardService.getRewardOfferingReq({status: 'open'}).toPromise().then(
      res => this.open = res.data.rewards
    )
    console.log(this.open)

    await this.rewardService.getRewardOfferingReq({status: 'rejected'}).toPromise().then(
      res => this.rejected = res.data.rewards
    )
    console.log(this.rejected)

    await this.rewardService.getRewardOfferingReq({status: 'close'}).toPromise().then(
      res => this.close = res.data.rewards
    )
    console.log(this.close)

    this.countryOptions.push({label: 'All', value: 'All'});
    for(var i=0; i<this.countries.length; i++) {
      this.countryOptions.push({label: this.countries[i], value: this.countries[i]});
    }
  }

  async onFilterCountry(event, type) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    if(type == 'pending') {
      if(value == 'All') {
        arr = this.pending;
      } else {
        for(var m=0; m<this.pending.length; m++) {
          if(this.pending[m].country == value) {
            arr.push(this.pending[m]);
          }
        }
      }
      this.pending = arr;
    } else if(type == 'open') {
      if(value == 'All') {
        arr = this.open;
      } else {
        for(var m=0; m<this.open.length; m++) {
          if(this.open[m].country == value) {
            arr.push(this.open[m]);
          }
        }
      }
      this.open = arr;
    } else if(type == 'rejected') {
      if(value == 'All') {
        arr = this.rejected;
      } else {
        for(var m=0; m<this.rejected.length; m++) {
          if(this.rejected[m].country == value) {
            arr.push(this.rejected[m]);
          }
        }
      }
      this.rejected = arr;
    } else if(type == 'close') {
      if(value == 'All') {
        arr = this.close;
      } else {
        for(var m=0; m<this.close.length; m++) {
          if(this.close[m].country == value) {
            arr.push(this.close[m]);
          }
        }
      }
      this.close = arr;
    }
  }

  formatDate(date): any {
    // let formattedDate = new Date(date).toUTCString();
    let formattedDate = new Date(date).toDateString();
    return formattedDate.substring(4, formattedDate.length);
    // return formattedDate.substring(5, formattedDate.length-13);
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
      endDate: reward.endDate.substring(0, 10),
      rewardImg: reward.imgPath,
      createdAt: reward.createdAt,
      accountImgPath: reward.accountImgPath,
      accountName: reward.accountName,
      accountUsername: reward.accountUsername,
      sponsorType: reward.sponsorType,
      verifyFile: reward.verifyFile,
      status: reward.status
    }
  }

  editReward(): void {
    this.isEdit = true;
  }

  cancelEdit(): void {
    this.isEdit = false;
  }

  downloadAttachment(filePath) {
    this.rewardService.getAttachmentFile(filePath).subscribe(
      response => {
        saveAs(response, this.attachmentPath);
      },
      err => {
        alert('Something went wrong while downloading the file. Please try again!');
      }
    )
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file = file;
    }
  }

  approveReq(reqId): any {
    let r = confirm("Are you sure you want to approve this reward offering?");
    if (r == true) {
      this.rewardService.validateReward({id: reqId, action: 'approve'}).subscribe(
        res => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Reward offering approved!'});
          window.location.reload();
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  rejectReq(reqId): any {
    let r = confirm("Are you sure you want to reject this reward offering?");
    if (r == true) {
      this.rewardService.validateReward({id: reqId, action: 'reject'}).subscribe(
        res => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Reward offering rejected!'});
          window.location.reload();
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  updateReward(): void {
    const formData = new FormData();
    console.log(this.editForm.endDate)
    formData.append("rewardId", this.editForm.id);
    formData.append("title", this.editForm.title);
    formData.append("desc", this.editForm.desc || '');
    formData.append("country", this.editForm.country);
    formData.append("point", this.editForm.point);
    formData.append("quota", this.editForm.quota);
    formData.append("minTier", this.editForm.minTier);
    formData.append("rewardImg", this.file);
    formData.append("endDate", this.editForm.endDate);

    this.rewardService.updateReward(formData).subscribe(
      res => {
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Reward updated!' });
        this.isEdit = false;
        // window.location.reload();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
      }
    )
  }

  deleteReward(reqId): any {
    let r = confirm("Are you sure you want to delete this reward?");
    if (r == true) {
      this.rewardService.deleteReward({id: reqId}).subscribe(
        res => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Reward deleted!'});
          window.location.reload();
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }
}
