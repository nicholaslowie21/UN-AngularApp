import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PaidResourceService } from '../services/paid-resource.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.css'],
  providers: [MessageService]
})
export class MyPurchasesComponent implements OnInit {

  pendingReqs: any[];
  acceptedReqs: any[];
  declinedReqs: any[];
  cancelledReqs: any[];

  myProjectsLink = '';

  constructor(private paidResourceService: PaidResourceService, private messageService: MessageService, private tokenStorageService: TokenStorageService) { }

  async ngOnInit() {
    // retrieve purchase requests
    await this.paidResourceService.getMyPurchases({status: 'pending'}).toPromise().then(
      res => {this.pendingReqs = res.data.paidrequests}
    );

    await this.paidResourceService.getMyPurchases({status: 'accepted'}).toPromise().then(
      res => {this.acceptedReqs = res.data.paidrequests}
    );

    await this.paidResourceService.getMyPurchases({status: 'declined'}).toPromise().then(
      res => {this.declinedReqs = res.data.paidrequests}
    );

    await this.paidResourceService.getMyPurchases({status: 'cancelled'}).toPromise().then(
      res => {this.cancelledReqs = res.data.paidrequests}
    );

    let username = this.tokenStorageService.getUser().username;
    this.myProjectsLink = "/project/myProjects?username="+username;

    if(this.tokenStorageService.getAccountType() == 'user') {
      this.myProjectsLink += "&type=individual";
    } else {
      this.myProjectsLink += "&type=institution";
    }
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  cancelPurchaseReq(reqId): void {
    let r = confirm("Are you sure you want to cancel this request?");
    if (r == true) {
      this.paidResourceService.updateBuyerRequestStatus({id: reqId, status: 'cancelled'}).subscribe(
        response => {
          this.messageService.add({key:'toastMsg', severity:'success', summary:'Success', detail:'Purchase request cancelled!'});
          this.ngOnInit();
        }, 
        err => {
          this.messageService.add({key:'toastMsg', severity:'error', summary:'Error', detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

}
