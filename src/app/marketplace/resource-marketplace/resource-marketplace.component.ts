import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../../services/marketplace.service';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../../services/project.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { PaidResourceService } from '../../services/paid-resource.service';

@Component({
  selector: 'app-resource-marketplace',
  templateUrl: './resource-marketplace.component.html',
  styleUrls: ['./resource-marketplace.component.css'],
  providers: [MessageService]
})
export class ResourceMarketplaceComponent implements OnInit {

  items: any = [];
  knowledges: any = [];
  manpowers: any = [];
  venues: any = [];
  paids: any = [];

  sortOptions: any = [];
  sortOrder: number;
  sortOrderMpw: number;
  sortOrderVen: number;
  sortOrderKno: number;
  sortOrderPaid: number;

  sortField: string;
  sortFieldMpw: string;
  sortFieldVen: string;
  sortFieldKno: string;
  sortFieldPaid: string;

  sortKeyItem = '';
  sortKeyMpw = '';
  sortKeyVen = '';
  sortKeyKno = '';
  sortKeyPaid = '';

  countries = ["All","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  countryOptions = [];
  filterKeyCountryItem = '';
  filterKeyCountryMpw = '';
  filterKeyCountryVen = '';
  filterKeyCountryPaid = '';

  form: any = {};
  myProjects: any[];
  selectedResourceId: any;
  selectedResourceType: any;
  resourceNeeds: any[];
  projectSelected: boolean = false;
  selectedProjectId: any;
  selectedResourceNeedId: any;
  autogenerateYes: boolean = false;

  isRequestSuccessful = false;
  isUseKnowledgeSuccessful = false;

  loggedInUsername: any;

  constructor(private route: ActivatedRoute, private marketplaceService: MarketplaceService, private messageService: MessageService, private projectService: ProjectService, private tokenStorageService: TokenStorageService, private paidResourceService: PaidResourceService) { }

  async ngOnInit() {
    await this.marketplaceService.getItemOffers().toPromise().then(res => this.items = res.data.items);
    await this.marketplaceService.getKnowledgeOffers().toPromise().then(res => this.knowledges = res.data.knowledges);
    await this.marketplaceService.getManpowerOffers().toPromise().then(res => this.manpowers = res.data.manpowers);
    await this.marketplaceService.getVenueOffers().toPromise().then(res => this.venues = res.data.venues);
    await this.marketplaceService.getPaidOffers().toPromise().then(res => this.paids = res.data.paidresources);
    console.log(this.items);
    console.log(this.manpowers);
    console.log(this.knowledges);
    console.log(this.venues);
    console.log(this.paids);

    this.sortOptions = [
      {label: 'Date Newest to Oldest', value: '!updatedAt'},
      {label: 'Date Oldest to Newest', value: 'updatedAt'}
    ];

    for (let i = 0; i < this.countries.length; i++) {
      this.countryOptions.push({label: this.countries[i], value: this.countries[i]});
    }

    // retrieve current user's projects
    await this.marketplaceService.getUserProjects({id: this.tokenStorageService.getUser().id, accountType: this.tokenStorageService.getAccountType()}).toPromise().then(
      res => this.myProjects = res.data.theProjects
    );

    this.isRequestSuccessful = false;
    this.isUseKnowledgeSuccessful = false;

    this.loggedInUsername = this.tokenStorageService.getUser().username;
  }
  
  onSortChangeItem(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
    }
  }

  onSortChangeManpower(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
        this.sortOrderMpw = -1;
        this.sortFieldMpw = value.substring(1, value.length);
    }
    else {
        this.sortOrderMpw = 1;
        this.sortFieldMpw = value;
    }
  }

  onSortChangeVenue(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
        this.sortOrderVen = -1;
        this.sortFieldVen = value.substring(1, value.length);
    }
    else {
        this.sortOrderVen = 1;
        this.sortFieldVen = value;
    }
  }

  onSortChangeKnowledge(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
        this.sortOrderKno = -1;
        this.sortFieldKno = value.substring(1, value.length);
    }
    else {
        this.sortOrderKno = 1;
        this.sortFieldKno = value;
    }
  }

  onSortChangePaid(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
        this.sortOrderPaid = -1;
        this.sortFieldPaid = value.substring(1, value.length);
    }
    else {
        this.sortOrderPaid = 1;
        this.sortFieldPaid = value;
    }
  }

  async filterCountryItems(event) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    if(value == 'All') {
      arr = this.items;
    } else {
      for(let i = 0; i < this.items.length; i++) {
        if(this.items[i].country == value) {
          arr.push(this.items[i]);
        }
      }
    }
    
    this.items = arr;
    this.sortKeyItem = '';
  }

  async filterCountryMpws(event) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    if(value == 'All') {
      arr = this.manpowers;
    } else {
      for(let i = 0; i < this.manpowers.length; i++) {
        if(this.manpowers[i].country == value) {
          arr.push(this.manpowers[i]);
        }
      }
    }
    
    this.manpowers = arr;
    this.sortKeyMpw = '';
  }

  async filterCountryVens(event) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    if(value == 'All') {
      arr = this.venues;
    } else {
      for(let i = 0; i < this.venues.length; i++) {
        if(this.venues[i].country == value) {
          arr.push(this.venues[i]);
        }
      }
    }
    
    this.venues = arr;
    this.sortKeyVen = '';
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  setResourceId(resourceId) {
    this.selectedResourceId = resourceId;
    console.log(this.selectedResourceId);
  }

  setResourceType(resourceType) {
    this.selectedResourceType = resourceType;
    console.log(this.selectedResourceType);
  }

  async updateSelectedProject(event) {
    this.selectedProjectId = event.target.value;
    this.projectSelected = true;
    console.log(this.selectedProjectId);
    await this.projectService.getProjectResourceNeeds({id: this.selectedProjectId}).toPromise().then(
      res => this.resourceNeeds = res.data.resourceneeds
    );
    this.filterResourceNeeds();
  }

  // show only resource needs of the same type as the one being requested
  filterResourceNeeds(): void {
    let arr = [];
    for (let i = 0; i < this.resourceNeeds.length; i++) {  
      if (this.resourceNeeds[i].type == this.selectedResourceType && this.resourceNeeds[i].completion != 100) {
        arr.push(this.resourceNeeds[i]);
      }
    }
    this.resourceNeeds = arr;
  }

  updateSelectedResourceNeed(event) {
    this.selectedResourceNeedId = event.target.value;
  }

  updateAutogenerate(event) {
    this.autogenerateYes = event.target.checked;
  }

  // for requesting non-knowledge resource
  onSubmit(): void {
    if (this.autogenerateYes) {
      // auto-generate resource need
      const formCreate = {
        resourceId: this.selectedResourceId,
        projectId: this.selectedProjectId,
        resType: this.selectedResourceType,
        desc: this.form.desc || ''
      };
      this.marketplaceService.requestResourceAuto(formCreate).subscribe(
        response => {
          // this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource request and resource need created!'})
          this.isRequestSuccessful = true;
          // window.location.reload();
        }, 
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      const formCreate = {
        needId: this.selectedResourceNeedId,
        resourceId: this.selectedResourceId,
        resType: this.selectedResourceType,
        desc: this.form.desc || ''
      };

      this.marketplaceService.requestResource(formCreate).subscribe(
        response => {
          // this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource request created!'});
          // window.location.reload();
          this.isRequestSuccessful = true;
        }, 
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    }
  }

  // for requesting knowledge resource
  onSubmitKnowledge(): void {
    if (this.autogenerateYes) {
      // auto-generate resource need
      const formCreate = {
        resourceId: this.selectedResourceId,
        projectId: this.selectedProjectId,
        desc: this.form.desc || ''
      };
      this.marketplaceService.useKnowledgeResourceAuto(formCreate).subscribe(
        response => {
          // this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource request and resource need created!'});
          // window.location.reload();
          this.isUseKnowledgeSuccessful = true;
        }, 
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      const formCreate = {
        needId: this.selectedResourceNeedId,
        resourceId: this.selectedResourceId,
        desc: this.form.desc || ''
      };

      this.marketplaceService.useKnowledgeResource(formCreate).subscribe(
        response => {
          // this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource request created!'});
          // window.location.reload();
          this.isUseKnowledgeSuccessful = true;
        }, 
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    }
  }

  closeModal(): void {
    this.ngOnInit();
    this.selectedResourceNeedId = '';
    this.selectedResourceId = '';
    this.selectedProjectId = '';
    this.selectedResourceType = '';
    this.form.desc = '';
  }

  async filterCountryPaids(event) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    if(value == 'All') {
      arr = this.paids;
    } else {
      for(let i = 0; i < this.paids.length; i++) {
        if(this.paids[i].country == value) {
          arr.push(this.paids[i]);
        }
      }
    }
    
    this.paids = arr;
    this.sortKeyPaid = '';
  }

  onSubmitPaid(): void {
    console.log(this.selectedProjectId);
    console.log(this.selectedResourceId);
    this.paidResourceService.createPurchaseReq({id: this.selectedResourceId, projId: this.selectedProjectId}).subscribe(
      response => {
        console.log(response);
        this.isRequestSuccessful = true;
      }
    );
  }

}
