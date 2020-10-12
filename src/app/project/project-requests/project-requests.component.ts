import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { MarketplaceService } from '../../services/marketplace.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-project-requests',
  templateUrl: './project-requests.component.html',
  styleUrls: ['./project-requests.component.css'],
  providers: [MessageService]
})
export class ProjectRequestsComponent implements OnInit {

  projectId: any;
  resourceNeeds = [];

  inPen = 'ip';
  inAcc = 'ia';
  inDec = 'id';
  inCan = 'ic';

  outPen = 'op';
  outAcc = 'oa';
  outDec = 'od';
  outCan = 'oc';

  iPending = [];
  iAccepted = [];
  iDeclined = [];
  iCancelled = [];
  oPending = [];
  oAccepted = [];
  oDeclined = [];
  oCancelled = [];

  filterNeedOptions = [];

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private marketplaceService: MarketplaceService,
    private messageService: MessageService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.projectId = params.id;
      }
    );

    await this.projectService.getProjectResourceNeeds({ id: this.projectId }).toPromise().then(
      res => this.resourceNeeds = res.data.resourceneeds
    )

    this.filterNeedOptions.push({label: 'All', value: 'all'});
    for(var i=0; i<this.resourceNeeds.length; i++) {
      this.filterNeedOptions.push({label: this.resourceNeeds[i].title, value: this.resourceNeeds[i].id})
    }

    await this.loadData();
  }

  async loadData() {
    await this.marketplaceService.viewProjIncomingProjReq({reqStatus: 'pending', id: this.projectId}).toPromise().then(
      res => this.iPending = res.data.projectPageProjectReqs
    );
    await this.marketplaceService.viewProjIncomingProjReq({reqStatus: 'accepted', id: this.projectId}).toPromise().then(
      res => this.iAccepted = res.data.projectPageProjectReqs
    );
    await this.marketplaceService.viewProjIncomingProjReq({reqStatus: 'declined', id: this.projectId}).toPromise().then(
      res => this.iDeclined = res.data.projectPageProjectReqs
    );
    await this.marketplaceService.viewProjIncomingProjReq({reqStatus: 'cancelled', id: this.projectId}).toPromise().then(
      res => this.iCancelled = res.data.projectPageProjectReqs
    );

    await this.marketplaceService.viewProjOutgoingResReq({reqStatus: 'pending', id: this.projectId}).toPromise().then(
      res => this.oPending = res.data.projectPageResourceReqs
    );
    await this.marketplaceService.viewProjOutgoingResReq({reqStatus: 'accepted', id: this.projectId}).toPromise().then(
      res => this.oAccepted = res.data.projectPageResourceReqs
    );
    await this.marketplaceService.viewProjOutgoingResReq({reqStatus: 'declined', id: this.projectId}).toPromise().then(
      res => this.oDeclined = res.data.projectPageResourceReqs
    );
    await this.marketplaceService.viewProjOutgoingResReq({reqStatus: 'cancelled', id: this.projectId}).toPromise().then(
      res => this.oCancelled = res.data.projectPageResourceReqs
    );
    console.log(this.oCancelled)
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  async ipfilterByNeed(event, type) {
    let value = event.value;
    await this.loadData();
    if(value == 'all') {
      return;
    }
    let arr = [];
    if(type[0] === 'ip') {
      for(var i=0; i<this.iPending.length; i++) {
        if(this.iPending[i].needId == value) {
          arr.push(this.iPending[i]);
        }
      }
      this.iPending = arr;
    } else if(type[0] === 'ia') {
      for(var i=0; i<this.iAccepted.length; i++) {
        if(this.iAccepted[i].needId == value) {
          arr.push(this.iAccepted[i]);
        }
      }
      this.iAccepted = arr;
    } else if(type[0] === 'id') {
      for(var i=0; i<this.iDeclined.length; i++) {
        if(this.iDeclined[i].needId == value) {
          arr.push(this.iDeclined[i]);
        }
      }
      this.iDeclined = arr;
    } else if(type[0] === 'ic') {
      for(var i=0; i<this.iCancelled.length; i++) {
        if(this.iCancelled[i].needId == value) {
          arr.push(this.iCancelled[i]);
        }
      }
      this.iCancelled = arr;
    } else if(type[0] === 'op') {
      for(var i=0; i<this.oPending.length; i++) {
        if(this.oPending[i].needId == value) {
          arr.push(this.oPending[i]);
        }
      }
      this.oPending = arr;
    } else if(type[0] === 'oa') {
      for(var i=0; i<this.oAccepted.length; i++) {
        if(this.oAccepted[i].needId == value) {
          arr.push(this.oAccepted[i]);
        }
      }
      this.oAccepted = arr;
    } else if(type[0] === 'od') {
      for(var i=0; i<this.oDeclined.length; i++) {
        if(this.oDeclined[i].needId == value) {
          arr.push(this.oDeclined[i]);
        }
      }
      this.oDeclined = arr;
    } else if(type[0] === 'oc') {
      for(var i=0; i<this.oCancelled.length; i++) {
        if(this.oCancelled[i].needId == value) {
          arr.push(this.oCancelled[i]);
        }
      }
      this.oCancelled = arr;
    }
    
  }

  acceptProjReq(reqId): void {
    let r = confirm("Are you sure you want to accept this request?");
    if (r == true) {
      this.marketplaceService.acceptProjectReq({id: reqId}).subscribe(
        res => {
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Request accepted!' });
          this.loadData();
        },
        err => {
          this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        }
      )
    } else {
      return;
    }
  }

  declineProjReq(reqId): void {
    let r = confirm("Are you sure you want to decline this request?");
    if (r == true) {
      this.marketplaceService.declineProjectReq({id: reqId}).subscribe(
        res => {
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Request declined!' });
          this.loadData();
        },
        err => {
          this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        }
      )
    } else {
      return;
    }
  }
  
  completeProjReq(reqId): void {
    let r = confirm("Are you sure you want to complete this request?");
    if (r == true) {
      this.marketplaceService.completeProjectReq({id: reqId}).subscribe(
        res => {
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Request completed!' });
          this.loadData();
        },
        err => {
          this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        }
      )
    } else {
      return;
    }
  }
  
  cancelProjReq(reqId): void {
    let r = confirm("Are you sure you want to cancel this request?");
    if (r == true) {
      this.marketplaceService.cancelProjectReq({id: reqId}).subscribe(
        res => {
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Request cancelled!' });
          this.loadData();
        },
        err => {
          this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        }
      )
    } else {
      return;
    }
  }

  cancelResReq(reqId): void {
    let r = confirm("Are you sure you want to cancel this request?");
    if (r == true) {
      this.marketplaceService.cancelResourceReq({id: reqId}).subscribe(
        res => {
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Request cancelled!' });
          this.loadData();
        },
        err => {
          this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        }
      )
    } else {
      return;
    }
  }

}
