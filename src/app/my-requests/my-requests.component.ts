import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../services/marketplace.service';
import { MessageService } from 'primeng/api';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css'],
  providers: [MessageService]
})
export class MyRequestsComponent implements OnInit {

  myResources: any[];

  pendingProjectReqs: any[];
  acceptedProjectReqs: any[];
  declinedProjectReqs: any[];
  cancelledProjectReqs: any[];

  constructor(private marketplaceService: MarketplaceService, private messageService: MessageService, private tokenStorageService: TokenStorageService) { }

  async ngOnInit() {
    // retrieve project requests
    await this.marketplaceService.viewMyResOutgoingProjReq({reqStatus: 'pending'}).toPromise().then(
      res => {this.pendingProjectReqs = res.data.projectReqs}
    );
    await this.marketplaceService.viewMyResOutgoingProjReq({reqStatus: 'accepted'}).toPromise().then(
      res => {this.acceptedProjectReqs = res.data.projectReqs}
    );
    await this.marketplaceService.viewMyResOutgoingProjReq({reqStatus: 'declined'}).toPromise().then(
      res => {this.declinedProjectReqs = res.data.projectReqs}
    );
    await this.marketplaceService.viewMyResOutgoingProjReq({reqStatus: 'cancelled'}).toPromise().then(
      res => {this.cancelledProjectReqs = res.data.projectReqs}
    );
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  cancelProjectReq(reqId): void {
    let r = confirm("Are you sure you want to cancel this request?");
    if (r == true) {
      this.marketplaceService.cancelProjectReq({id: reqId}).subscribe(
        response => {
          this.messageService.add({key:'toastMsg', severity:'success', summary:'Success', detail:'Project request cancelled!'});
          window.location.reload();
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
