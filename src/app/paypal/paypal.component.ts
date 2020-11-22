
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { MessageService } from 'primeng/api';

declare let paypal

@Component({
  selector: 'app-paypal',
  templateUrl: 'paypal.component.html',
  styleUrls: ['paypal.component.css'],
})
export class PaypalComponent implements AfterViewChecked{
    addScript: boolean = false;
    paypalLoad: boolean = true;
    finalAmount: number = 1;
  isSuccess: boolean;
  paymentDeets: any;

constructor() {

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
          this.isSuccess = true;
          this.paymentDeets = payment;
          //payment is:
          /*cart: "1A376087TB2369446"
              create_time: "2020-11-18T07:41:14Z"
              id: "PAYID-L62NAGY2WF15707DS6764427"
              intent: "sale"
              payer: {
                payer_info: {
                  country_code: "SG"
              email: "sb-15efg3748187@personal.example.com"
              first_name: "John"
              last_name: "Doe"
              middle_name: "John"
              payer_id: "GJ8ZDJXX375ZW"
              shipping_address: {
                city: "Singapore"
              country_code: "SG"
              line1: "123 Thomson Rd."
              postal_code: "308123"
              recipient_name: "Doe John"
              state: "SG_zip = 308123"
              }
              __proto__: Object
            __proto__: Object
            }

              payment_method: "paypal"
              status: "VERIFIED"
              __proto__: Object
              }

              state: "approved"
              transactions: [{…}]
              __proto__: Object*/
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


}
