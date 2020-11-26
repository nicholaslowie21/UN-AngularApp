import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PaidResourceService } from '../services/paid-resource.service';
import { TokenStorageService } from '../services/token-storage.service';
import * as moment from 'moment';

declare let paypal

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.css'],
  providers: [MessageService]
})
export class MyPurchasesComponent implements OnInit, AfterViewChecked {

  pendingReqs: any[];
  acceptedReqs: any[];
  declinedReqs: any[];
  cancelledReqs: any[];

  myProjectsLink = '';

  reqForm: any = {resImg: ''};

  addScript: boolean = false;
  paypalLoad: boolean = true;
  finalAmount: number;
  isSuccess = false;
  paymentDeets: any;

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

    console.log(this.acceptedReqs)
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

  paidPurchaseReq(): void {
    this.paidResourceService.updateBuyerRequestStatus({id: this.reqForm.id, status: 'paid'}).subscribe(
      response => {
        this.messageService.add({key:'toastMsg', severity:'success', summary:'Success', detail:'Payment successful!'});
        this.ngOnInit();
      }, 
      err => {
        this.messageService.add({key:'toastMsg', severity:'error', summary:'Error', detail:err.error.msg});
      }
    );
  }

  getForm(req): void {
    this.reqForm = {
      id: req.id,
      desc: req.paidresource.desc,
      category: req.paidresource.category,
      country: req.paidresource.country,
      resId: req.paidresource.id,
      price: req.paidresource.price,
      resTitle: req.paidresource.title,
      ownerName: req.ownerName,
      projectTitle: req.projectTitle
    }
    if(req.paidresource.imgPath.length > 0) {
      this.reqForm.resImg = req.paidresource.imgPath[0];
    } else {
      this.reqForm.resImg = '';
    }
    this.finalAmount = req.paidresource.price;
    this.isSuccess = false;
  }

  formatDateTime(date): any {
    let formattedDateTime = moment(date).format("MMMM Do YYYY, h:mm:ss a");
    return formattedDateTime;
  }

  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'ATYIGhVI_8iXzrGnY_2ppcz1AJR8mpQp6IxHxdWXRVXwbcVFamkz-6qjBiYSOHidvvRjvxwkir2jvIka',
      production: '<your-production-key>'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            {amount: {total: this.finalAmount, currency: 'USD'}}
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        //Do something when payment is successful.
        console.log(payment);
        this.paidPurchaseReq();
        this.isSuccess = true;
        this.paymentDeets = payment;
      })
    }
  };

  ngAfterViewChecked(): void {
    if(!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
        this.paypalLoad = false;
      })
    }
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script'); //<script src=""></script>
      scripttagElement.src = "https://www.paypalobjects.com/api/checkout.js";
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }

  closeModal() {
    if(this.isSuccess)  window.location.reload();
  }

}
