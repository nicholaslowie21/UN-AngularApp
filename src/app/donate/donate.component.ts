import { Component, OnInit, AfterViewChecked  } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

declare let paypal

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css'],
  providers: [MessageService]
})
export class DonateComponent implements AfterViewChecked {

  addScript: boolean = false;
  paypalLoad: boolean = true;
  finalAmount: number = 1;
  isSuccess: boolean;
  paymentDeets: any;

  constructor(private messageService: MessageService) { }

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
        },
        experience: {
          input_fields: {
            no_shipping: 1
          }
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        //Do something when payment is successful.
        console.log(payment);
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

  formatDateTime(date): any {
    let formattedDateTime = moment(date).format("MMMM Do YYYY, h:mm:ss a");
    return formattedDateTime;
  }

}
