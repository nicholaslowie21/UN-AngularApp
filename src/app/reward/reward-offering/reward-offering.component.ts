import { Component, OnInit } from '@angular/core';
import { RewardService } from '../../services/reward.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reward-offering',
  templateUrl: './reward-offering.component.html',
  styleUrls: ['./reward-offering.component.css'],
  providers: [MessageService]
})
export class RewardOfferingComponent implements OnInit {

  rewards = [];
  sortOrder: number;
  sortField: string;

  constructor(private rewardService: RewardService, private messageService: MessageService) { }

  async ngOnInit() {
    await this.rewardService.getRewardOfferings().toPromise().then(
      res => this.rewards = res.data.rewards
    );
    console.log(this.rewards);
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  cancelReward(rewId): any {
    let r = confirm("Are you sure you want to cancel this reward offering?");
    if (r == true) {
      this.rewardService.cancelPendingRewardOffer({id: rewId}).subscribe(
        res => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Reward offering is cancelled!'});
          this.ngOnInit();
        }, err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
    
  }

}
