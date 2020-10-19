import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { MessageService } from 'primeng/api';
import { ResourceService } from '../../services/resource.service';
import { MarketplaceService } from '../../services/marketplace.service';
import { JsonpClientBackend } from '@angular/common/http';
import { constants } from 'buffer';

@Component({
  selector: 'app-project-resources',
  templateUrl: './project-resources.component.html',
  styleUrls: ['./project-resources.component.css'],
  providers: [MessageService]
})

export class ProjectResourcesComponent implements OnInit {

  projectId: any;
  project: any;

  isOwnerAdmin = false;
  user: any;
  userType: any;

  resourceNeeds = [];
  needsMap = [];
  needsChecked = [];
  contributions = [];
  progress = 0;

  sortOrderNeeds: number;
  sortOrderCb: number;
  sortFieldNeeds: string;
  sortFieldCb: string;
  sortOptions: any = [];
  filterStatusOptions: any = [];
  filterTypeOptions: any = [];
  sortKeyNeeds = '';
  sortKeyCb = '';
  filterKeyNeeds = '';
  filterKeyCb = '';
  filterKeyNeedType = '';
  filterKeyCbType = '';

  form: any = {};
  updateForm: any = {};

  resourceType = '';
  item = [];
  knowledge = [];
  manpower = [];
  venue = [];

  reqDescription = '';
  resMap = [];
  resChecked = [];
  typeMap = '';
  isUpdateSuccessful = false;
  finalNeed = '';
  finalRes = '';
  tempResId: any;

  tempNeed: any;
  tempType: any;
  checkBox = true;

  resNeedSuggestion: any;
  checkClick = false;
  suggestedType: any;

  contributionForm: any = {};
  oldRating: any;
  needForm: any = {};

  constructor(private route: ActivatedRoute, private projectService: ProjectService,
    private tokenStorageService: TokenStorageService, private messageService: MessageService,
    private resourceService: ResourceService, private marketplaceService: MarketplaceService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.projectId = params.id;
      }
      );
    this.sortOptions = [
      { label: 'Date Newest to Oldest', value: '!updatedAt' },
      { label: 'Date Oldest to Newest', value: 'updatedAt' }
    ];
    this.filterStatusOptions = [
      { label: 'All', value: 'all' },
      { label: 'In progress', value: 'progress' },
      { label: 'Completed', value: 'completed' }
    ];
    this.filterTypeOptions = [
      { label: 'All', value: 'all' },
      { label: 'Item', value: 'item' },
      { label: 'Manpower', value: 'manpower' },
      { label: 'Venue', value: 'venue' },
      { label: 'Knowledge', value: 'knowledge' },
      { label: 'Money', value: 'money' }
    ];

    console.log(this.tokenStorageService.getToken());
    this.user = this.tokenStorageService.getUser();
    if (this.tokenStorageService.getAccountType() == 'user') {
      this.userType = 'individual';
      await this.resourceService.getUserItem({ id: this.user.id }).toPromise().then(
        res => this.item = res.data.items
      );
      await this.resourceService.getUserKnowledge({ id: this.user.id }).toPromise().then(
        res => this.knowledge = res.data.knowledges
      );
      await this.resourceService.getUserManpower({ id: this.user.id }).toPromise().then(
        res => this.manpower = res.data.manpowers
      );
      await this.resourceService.getUserVenue({ id: this.user.id }).toPromise().then(
        res => this.venue = res.data.venues
      );
      console.log(this.item);
    } else {
      this.userType = 'institution';
      await this.resourceService.getInstitutionItem({ id: this.user.id }).toPromise().then(
        res => this.item = res.data.items
      );
      await this.resourceService.getInstitutionKnowledge({ id: this.user.id }).toPromise().then(
        res => this.knowledge = res.data.knowledges
      );
      await this.resourceService.getInstitutionVenue({ id: this.user.id }).toPromise().then(
        res => this.venue = res.data.venues
      );
    }

    await this.projectService.viewProject({ id: this.projectId }).toPromise().then(
      res => this.project = res.data.targetProject
    )

    if (this.project.host == this.user.id) {
      this.isOwnerAdmin = true;
    } else {
      for (var i = 0; i < this.project.admins.length; i++) {
        if (this.project.admins[i] == this.user.id) {
          this.isOwnerAdmin = true;
          break;
        }
      }
    }

    await this.projectService.getProjectResourceNeeds({ id: this.projectId }).toPromise().then(
      res => this.resourceNeeds = res.data.resourceneeds
    )

    await this.projectService.getProjectContributions({ id: this.projectId }).toPromise().then(
      res => this.contributions = res.data.contributions
    )

    this.calculateProgress();
    console.log(this.resourceNeeds);
    console.log(JSON.stringify(this.contributions));
  }

  calculateProgress(): void {
    this.progress = 0;
    if (this.resourceNeeds.length == 0) {
      this.progress = 0;
    } else {
      for (var i = 0; i < this.resourceNeeds.length; i++) {
        this.progress += this.resourceNeeds[i].completion;
      }
      this.progress = this.progress / (this.resourceNeeds.length * 100) * 100;
      this.progress = parseFloat(this.progress.toFixed(2));
    }
  }

  calculateRemaining(pending, received, total) {
    return total - pending - received;
  }

  onSortChangeNeeds(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrderNeeds = -1;
      this.sortFieldNeeds = value.substring(1, value.length);
    }
    else {
      this.sortOrderNeeds = 1;
      this.sortFieldNeeds = value;
    }
  }

  async filterNeedsStatus(event) {
    console.log(event);
    this.filterKeyNeeds = event.value;
    console.log(this.resourceNeeds);
    await this.ngOnInit();
    let value = event.value;
    let arr = [];
    if (value == 'progress') {
      for (var i = 0; i < this.resourceNeeds.length; i++) {
        if (this.resourceNeeds[i].status == 'progress') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else if (value == 'completed') {
      for (var i = 0; i < this.resourceNeeds.length; i++) {
        if (this.resourceNeeds[i].status == 'completed') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else {
      arr = this.resourceNeeds;
    }

    let tempArr = [];
    if (this.filterKeyNeedType == 'item') {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].type == 'item') {
          tempArr.push(arr[i]);
        }
      }
    } else if (this.filterKeyNeedType == 'manpower') {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].type == 'manpower') {
          tempArr.push(arr[i]);
        }
      }
    } else if (this.filterKeyNeedType == 'venue') {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].type == 'venue') {
          tempArr.push(arr[i]);
        }
      }
    } else if (this.filterKeyNeedType == 'knowledge') {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].type == 'knowledge') {
          tempArr.push(arr[i]);
        }
      }
    } else if (this.filterKeyNeedType == 'money') {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].type == 'money') {
          tempArr.push(arr[i]);
        }
      }
    } else {
      tempArr = arr;
    }

    this.resourceNeeds = tempArr;
  }

  async filterNeedsType(event) {
    this.filterKeyNeedType = event.value;
    await this.ngOnInit();
    let value = event.value;
    let arr = [];
    if (value == 'item') {
      for (var i = 0; i < this.resourceNeeds.length; i++) {
        if (this.resourceNeeds[i].type == 'item') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else if (value == 'manpower') {
      for (var i = 0; i < this.resourceNeeds.length; i++) {
        if (this.resourceNeeds[i].type == 'manpower') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else if (value == 'venue') {
      for (var i = 0; i < this.resourceNeeds.length; i++) {
        if (this.resourceNeeds[i].type == 'venue') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else if (value == 'knowledge') {
      for (var i = 0; i < this.resourceNeeds.length; i++) {
        if (this.resourceNeeds[i].type == 'knowledge') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else if (value == 'money') {
      for (var i = 0; i < this.resourceNeeds.length; i++) {
        if (this.resourceNeeds[i].type == 'money') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else {
      arr = this.resourceNeeds;
    }

    let tempArr = [];
    if (this.filterKeyNeeds == 'progress') {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].status == 'progress') {
          tempArr.push(arr[i]);
        }
      }
    } else if (this.filterKeyNeeds == 'completed') {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].status == 'completed') {
          tempArr.push(arr[i]);
        }
      }
    } else {
      tempArr = arr;
    }

    this.resourceNeeds = tempArr;
  }

  async filterCbType(event) {
    this.filterKeyCbType = event.value;
    await this.ngOnInit();
    let value = event.value;
    let arr = [];
    if (value == 'item') {
      for (var i = 0; i < this.contributions.length; i++) {
        if (this.contributions[i].resType == 'item') {
          arr.push(this.contributions[i]);
        }
      }
    } else if (value == 'manpower') {
      for (var i = 0; i < this.contributions.length; i++) {
        if (this.contributions[i].resType == 'manpower') {
          arr.push(this.contributions[i]);
        }
      }
    } else if (value == 'venue') {
      for (var i = 0; i < this.contributions.length; i++) {
        if (this.contributions[i].resType == 'venue') {
          arr.push(this.contributions[i]);
        }
      }
    } else if (value == 'knowledge') {
      for (var i = 0; i < this.contributions.length; i++) {
        if (this.contributions[i].resType == 'knowledge') {
          arr.push(this.contributions[i]);
        }
      }
    } else if (value == 'money') {
      for (var i = 0; i < this.contributions.length; i++) {
        if (this.contributions[i].resType == 'money') {
          arr.push(this.contributions[i]);
        }
      }
    } else {
      arr = this.contributions;
    }
    this.contributions = arr;
  }

  onSubmit(): void {
    const formCreate = {
      id: this.projectId,
      title: this.form.title,
      desc: this.form.desc || '',
      resourceType: this.form.resourceType,
      total: parseInt(this.form.total)
    }

    this.projectService.createResourceNeed(formCreate).subscribe(
      response => {
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Resource need created!' });
        window.location.reload();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
      }
    );
  }

  getForm(need): void {
    this.updateForm = {
      type: need.type,
      id: need.id,
      title: need.title,
      desc: need.desc,
      total: need.total,
      completion: need.completion
    }
  }

  markCompleteNeed(need): void {
    const formComplete = {
      id: need.id,
      title: need.title,
      desc: need.desc,
      total: parseInt(need.total),
      completion: 100
    }
    this.projectService.editResourceNeed(formComplete).subscribe(
      response => {
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Resource need marked as completed!' });
        this.ngOnInit();
        // window.location.reload();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
      }
    )
  }

  editResourceNeed(): void {
    console.log(this.updateForm.completion);
    const formEdit = {
      id: this.updateForm.id,
      title: this.updateForm.title,
      desc: this.updateForm.desc,
      total: parseInt(this.updateForm.total),
      completion: this.updateForm.completion
    }
    console.log(formEdit)
    this.projectService.editResourceNeed(formEdit).subscribe(
      response => {
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Resource need updated!' });
        window.location.reload();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
      }
    )
  }

  deleteNeed(need): void {
    let r = confirm("Are you sure you want to delete this resource need? Resources obtained for this resource need will be automatically deleted as well.");
    if (r == true) {
      this.projectService.deleteResourceNeed({ id: need.id }).subscribe(
        response => {
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Resource need deleted!' });
          this.ngOnInit();
        },
        err => {
          this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        }
      )
    } else {
      return;
    }
  }

  deleteObtained(cb): void {
    let r = confirm("Are you sure you want to delete this obtained resource?");
    if (r == true) {
      this.projectService.removeContribution({ id: cb.contributionId }).subscribe(
        response => {
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Resource obtained deleted!' });
          this.ngOnInit();
        },
        err => {
          this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        }
      )
    } else {
      return;
    }
  }

  updateCheckedNeeds(x, event) {
    this.needsMap[x] = event.target.checked;
    console.log(x);
  }

  updateCheckedRes(x, event) {
    //this.resMap[x] = event.target.checked;
    //console.log(x);
    this.tempResId = x;
    console.log(this.tempResId);
  }

  clearLists(): void {

  }

  onReqSubmit(): void {
    //check for valid selection and description

    /**console.log(this.needsMap);
    for (var x in this.needsMap) {
      if (this.needsMap[x]) {
        this.needsChecked.push(x);
      }
    }
    console.log(this.resMap);
    for (var x in this.resMap) {
      if (this.resMap[x]) {
        this.resChecked.push(x);
      }
    }
    console.log(this.needsChecked);
    console.log(this.resChecked);
    if (this.needsChecked.length == 0) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: "Select a resource need!" });
      console.log("select a resource need!");
    } else if (this.needsChecked.length > 1) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: "Select only 1 resource need!" });
      console.log("choose only 1 resource need!");
    } else {
      console.log("it's good (need)!");
      this.finalNeed = this.needsChecked[0];
      console.log(this.finalNeed);
    }

    if (this.resChecked.length == 0) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: "Select a resource!" });
      console.log("select a resource !");
    } else if (this.resChecked.length > 1) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: "Select only 1 resource!" });
      console.log("choose only 1 resource!");
    } else {
      console.log("it's good (res)!");
      this.finalRes = this.resChecked[0];
      console.log(this.finalRes);
    }
    console.log(this.typeMap.toLowerCase());
    console.log(this.reqDescription);

    if (this.needsChecked.length == 1 && this.resChecked.length == 1) {
    } **/

    const formReq = {
      needId: this.tempNeed,
      resourceId: this.tempResId,
      resType: this.tempType,
      desc: this.reqDescription
    }
    console.log(formReq);

    this.marketplaceService.createProjectRequest(formReq).subscribe(
      response => {
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Request created!' });
        window.location.reload();
      },
      err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
      }
    );

  }

  setReqParams(needId: string, type: string): void {
    this.tempNeed = needId;
    this.tempType = type;
    console.log("needId: " + this.tempNeed + ", type: " + this.tempType);
    if(this.tempType=="item") {
      if(this.item.length==0) {
        this.disableBox();
      }
    } else if(this.tempType=="manpower") {
      if(this.manpower.length==0) {
        this.disableBox();
      }
    } else if(this.tempType=="venue") {
      if(this.venue.length==0) {
        this.disableBox();
      }
    } else if(this.tempType=="knowledge") {
      if(this.knowledge.length==0) {
        this.disableBox();
      }
    }
  }

  checkMp(type: string): boolean {
    if (type == "money") {
      return false;
    }
    if (type == "manpower") {
      if (this.userType == "institution") {
        return false;
      } else if (this.userType == "individual") {
        return true;
      }
    } else {
      return true;
    }
  }

  checkCompletion(complete: number): boolean {
    if(complete==100){
      return false;
    } else {
      return true;
    }
  }

  disableBox(): void {
    this.checkBox = false;
  }

  getSuggestedRes(needId: string, type: string): void {
    console.log(needId);
    this.marketplaceService.getResourceSuggestion({id: needId}).subscribe(
      res => { this.resNeedSuggestion = res.data.suggestedResources;
      console.log(JSON.stringify(res)) }
    );
    console.log(JSON.stringify(this.resNeedSuggestion));
    this.checkClick = true;
    this.suggestedType = type;
    console.log(this.suggestedType);
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  getContributionForm(c): void {
    this.contributionForm = {
      id: c.contributionId,
      rating: c.rating,
      user: c.contributorName,
      need: c.needTitle,
      res: c.resourceTitle
    }

    this.oldRating = c.rating;
    console.log(this.oldRating);
  }

  updateContributionRating(): void {
    console.log("rating: " + this.contributionForm.rating);
    //var x = this.contributionForm.rating;
    //console.log("x: " + x);
    if(this.oldRating == this.contributionForm.rating) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: 'No change in rating' });
      return;
    } else {
      const uRateForm = {
        id: this.contributionForm.id,
        rating: this.contributionForm.rating
      }
  
      this.projectService.updateContributionRating(uRateForm).subscribe(
        res => {
          console.log(JSON.stringify(res));
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Rating updated!' });
          this.ngOnInit();
          //window.location.reload();
        },
        err => {
          this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
        }
      );
    }
  
  }

  getDonateForm(d): void {
    this.needForm = {
      id: d.id,
      amount: '',
      reqDesc: '',
      targetSum: d.total,
      pendingSum: d.pendingSum,
      receivedSum: d.receivedSum,
      remainingSum: (d.total-d.pendingSum-d.receivedSum)
    }
  }

  donate(): void {
    const formDonate = {
      id: this.needForm.id,
      desc: this.needForm.reqDesc || '',
      moneySum: parseInt(this.needForm.amount)
    }
    console.log(formDonate)
    this.marketplaceService.contributeMoney(formDonate).subscribe(
      response => {
        this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Your request to donate has been submitted!'});
        window.location.reload();
      },
      err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    );
  }
}
