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

  filterKeyTypePending: '';
  filterKeyTypeAccepted: '';
  filterKeyTypeDeclined: '';
  filterKeyTypeCancelled: '';
  filterTypeOptions: any[];

  myProjectsLink = '';  

  constructor(private marketplaceService: MarketplaceService, private messageService: MessageService, private tokenStorageService: TokenStorageService) { }

  async ngOnInit() {
    this.filterTypeOptions = [
      { label: 'All', value: 'all' },
      { label: 'Item', value: 'item' },
      { label: 'Manpower', value: 'manpower' },
      { label: 'Venue', value: 'venue' },
      { label: 'Knowledge', value: 'knowledge' },
      { label: 'Money', value: 'money' }
    ];
    
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

  async filterPendingReqs(event) {
    this.filterKeyTypePending = event.value;
    await this.ngOnInit();
    let value = event.value;
    let arr = [];
    if (value == 'all') {
      arr = this.pendingProjectReqs;
    } else {
      for (var i = 0; i < this.pendingProjectReqs.length; i++) {
        if (this.pendingProjectReqs[i].resType == value) {
          arr.push(this.pendingProjectReqs[i]);
        }
      }
    }
    this.pendingProjectReqs = arr;
  }

  async filterAcceptedReqs(event) {
    this.filterKeyTypeAccepted = event.value;
    await this.ngOnInit();
    let value = event.value;
    let arr = [];
    if (value == 'all') {
      arr = this.acceptedProjectReqs;
    } else {
      for (var i = 0; i < this.acceptedProjectReqs.length; i++) {
        if (this.acceptedProjectReqs[i].resType == value) {
          arr.push(this.acceptedProjectReqs[i]);
        }
      }
    }
    this.acceptedProjectReqs = arr;
  }

  async filterDeclinedReqs(event) {
    this.filterKeyTypeDeclined = event.value;
    await this.ngOnInit();
    let value = event.value;
    let arr = [];
    if (value == 'all') {
      arr = this.declinedProjectReqs;
    } else {
      for (var i = 0; i < this.declinedProjectReqs.length; i++) {
        if (this.declinedProjectReqs[i].resType == value) {
          arr.push(this.declinedProjectReqs[i]);
        }
      }
    }
    this.declinedProjectReqs = arr;
  }

  async filterCancelledReqs(event) {
    this.filterKeyTypeCancelled = event.value;
    await this.ngOnInit();
    let value = event.value;
    let arr = [];
    if (value == 'all') {
      arr = this.cancelledProjectReqs;
    } else {
      for (var i = 0; i < this.cancelledProjectReqs.length; i++) {
        if (this.cancelledProjectReqs[i].resType == value) {
          arr.push(this.cancelledProjectReqs[i]);
        }
      }
    }
    this.cancelledProjectReqs = arr;
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
