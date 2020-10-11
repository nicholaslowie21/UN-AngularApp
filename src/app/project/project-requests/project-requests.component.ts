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

  iPending = [];
  iAccepted = [];
  iDeclined = [];
  iCancelled = [];
  oPending = [];
  oAccepted = [];
  oDeclined = [];
  oCancelled = [];

  filterNeedOptions = [];

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private marketplaceService: MarketplaceService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.projectId = params.id;
      }
    );

    await this.projectService.getProjectResourceNeeds({ id: this.projectId }).toPromise().then(
      res => this.resourceNeeds = res.data.resourceneeds
    )

    for(var i=0; i<this.resourceNeeds.length; i++) {
      this.filterNeedOptions.push({label: this.resourceNeeds[i].title, value: this.resourceNeeds[i].id})
    }

    await this.loadData();
  }

  async loadData() {
    console.log("START LOAD DATA")
    await this.marketplaceService.viewProjIncomingProjReq({reqStatus: 'pending', id: this.projectId}).toPromise().then(
      res => this.iPending = res.data.projectPageProjectReqs
    );
    await this.marketplaceService.viewProjIncomingProjReq({reqStatus: 'accepted', id: this.projectId}).toPromise().then(
      res => this.iAccepted = res.data.projectPageProjectReqs
    );
    console.log(this.iAccepted)
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

    console.log("FINISH LOADING DATA")
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  async ipfilterByNeed(event, type) {
    console.log(typeof type[0]);
    console.log(type[0] === 'ip')
    let value = event.value;
    console.log(value)
    await this.loadData();
    let arr = [];
    if(type[0] === 'ip') {
      console.log("in if")
      for(var i=0; i<this.iPending.length; i++) {
        if(this.iPending[i].needId == value) {
          console.log(this.iPending[i].needId)
          arr.push(this.iPending[i]);
        }
      }
      this.iPending = arr;
    }
    
  }

}
