import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-my-resources',
  templateUrl: './my-resources.component.html',
  styleUrls: ['./my-resources.component.css']
})
export class MyResourcesComponent implements OnInit {

  user: any;
  isIndividual = false;
  items: any = [];
  knowledges: any = [];
  manpowers: any = [];
  venues: any = [];

  sortOptions: any = [];
  filterStatusOptions: any = [];
  sortOrder: number;
  sortOrderMpw: number;
  sortOrderVen: number;
  sortOrderKno: number;

  sortField: string;
  sortFieldMpw: string;
  sortFieldVen: string;
  sortFieldKno: string;

  sortKeyItem = '';
  sortKeyMpw = '';
  sortKeyVen = '';
  sortKeyKno = '';

  filterKeyItem = '';
  filterKeyMpw: any;
  filterKeyVen: any;
  filterKeyKno: any;

  checked = false;

  constructor(private tokenStorageService: TokenStorageService, private resourceService: ResourceService) { }

  async ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    this.isIndividual = this.user.role;

    this.sortOptions = [
      {label: 'Date Newest to Oldest', value: '!updatedAt'},
      {label: 'Date Oldest to Newest', value: 'updatedAt'}
    ];
    this.filterStatusOptions = [
      {label: 'All', value:'all'},
      {label: 'Active', value:'active'},
      {label: 'Inactive', value:'inactive'}
    ];

    if(this.isIndividual) {
      // this.items = await this.resourceService.getUserPrivateItem().toPromise().then(res => this.items=res.data.items);
      await this.resourceService.getUserPrivateItem().toPromise().then(res => this.items = res.data.items);
      await this.resourceService.getUserPrivateManpower().toPromise().then(res => this.manpowers = res.data.manpowers);
      await this.resourceService.getUserPrivateKnowledge().toPromise().then(res => this.knowledges = res.data.knowledges);
      await this.resourceService.getUserPrivateVenue().toPromise().then(res => this.venues = res.data.venues);
    } else {
      await this.resourceService.getInstitutionPrivateItem().toPromise().then(res => this.items = res.data.items);
      await this.resourceService.getInstitutionPrivateKnowledge().toPromise().then(res => this.knowledges = res.data.knowledges);
      await this.resourceService.getInstitutionPrivateVenue().toPromise().then(res => this.venues = res.data.venues);
    }
    console.log(this.items);
    console.log(this.manpowers);
    console.log(this.knowledges);
    console.log(this.venues);
  }

  checkStatus(a): boolean {
    if (a.status === 'active') {
      return true;
    } else {
      return false;
    }
  }

  handleChangeItem(e, item) {
    let isChecked = e.checked;
    if(isChecked)
      this.activateItem(item);
    else 
      this.deactivateItem(item);
  }

  handleChangeMpw(e, mpw) {
    let isChecked = e.checked;
    if(isChecked)
      this.activateManpower(mpw)
    else 
      this.deactivateManpower(mpw)
  }

  handleChangeVen(e, ven) {
    let isChecked = e.checked;
    if(isChecked)
      this.activateVenue(ven)
    else 
      this.deactivateVenue(ven)
  }

  handleChangeKno(e, kno) {
    let isChecked = e.checked;
    if(isChecked)
      this.activateKnowledge(kno)
    else 
      this.deactivateKnowledge(kno)
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

  async filterItemStatus(event) {
    this.filterKeyItem = event.value;
    await this.resourceService.getUserPrivateItem().toPromise().then(res => this.items = res.data.items);
    let value = event.value;
    let arr = [];
    if(value == 'active') {
      for(var i=0; i<this.items.length; i++) {
        if(this.items[i].status == 'active') {
          arr.push(this.items[i]);
        }
      }
    } else if(value == 'inactive') {
      for(var i=0; i<this.items.length; i++) {
        if(this.items[i].status == 'inactive') {
          arr.push(this.items[i]);
        }
      }
    } else {
      arr = this.items; 
    }
    console.log("FILTER ITEM STATUS");
    this.items = arr;
  }

  async filterManpowerStatus(event) {
    this.filterKeyMpw = event.value;
    await this.resourceService.getUserPrivateManpower().toPromise().then(res => this.manpowers = res.data.manpowers);
    let value = event.value;
    let arr = [];
    if(value == 'active') {
      for(var i=0; i<this.manpowers.length; i++) {
        if(this.manpowers[i].status == 'active') {
          arr.push(this.manpowers[i]);
        }
      }
    } else if(value == 'inactive') {
      for(var i=0; i<this.manpowers.length; i++) {
        if(this.manpowers[i].status == 'inactive') {
          arr.push(this.manpowers[i]);
        }
      }
    } else {
      arr = this.manpowers; 
    }
    this.manpowers = arr;
    console.log("FILTER MANPOWER");
  }

  async filterVenueStatus(event) {
    this.filterKeyVen = event.value;
    await this.resourceService.getUserPrivateVenue().toPromise().then(res => this.venues = res.data.venues);
    let value = event.value;
    let arr = [];
    if(value == 'active') {
      for(var i=0; i<this.venues.length; i++) {
        if(this.venues[i].status == 'active') {
          arr.push(this.venues[i]);
        }
      }
    } else if(value == 'inactive') {
      for(var i=0; i<this.venues.length; i++) {
        if(this.venues[i].status == 'inactive') {
          arr.push(this.venues[i]);
        }
      }
    } else {
      arr = this.venues; 
    }
    this.venues = arr;
  }

  async filterKnowledgeStatus(event) {
    this.filterKeyKno = event.value;
    await this.resourceService.getUserPrivateKnowledge().toPromise().then(res => this.knowledges = res.data.knowledges);
    let value = event.value;
    let arr = [];
    if(value == 'active') {
      for(var i=0; i<this.knowledges.length; i++) {
        if(this.knowledges[i].status == 'active') {
          arr.push(this.knowledges[i]);
        }
      }
    } else if(value == 'inactive') {
      for(var i=0; i<this.knowledges.length; i++) {
        if(this.knowledges[i].status == 'inactive') {
          arr.push(this.knowledges[i]);
        }
      }
    } else {
      arr = this.knowledges; 
    }
    this.knowledges = arr;
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  async deactivateItem(item) {
    this.resourceService.deactivateItem({id: item.id}).subscribe(
      response => {
        alert("Item " + item.title + " deactivated!");
        this.filterItemStatus({"value": this.filterKeyItem});
        this.sortKeyItem = '';
        // this.ngOnInit();
      }, err => {
        alert("Error: " + err.error.msg);
      }
    )
  }
  
  async activateItem(item) {
    this.resourceService.activateItem({id: item.id}).subscribe(
      response => {
        alert("Item " + item.title + " activated!");
        // this.ngOnInit();
        this.filterItemStatus({"value": this.filterKeyItem});
        this.sortKeyItem = '';
      }, err => {
        alert("Error: " + err.error.msg);
      }
    )
  }

  async deactivateManpower(manpower) {
    this.resourceService.deactivateManpower({id: manpower.id}).subscribe(
      response => {
        alert("Manpower " + manpower.title + " deactivated!");
        // this.ngOnInit();
        this.filterManpowerStatus({"value": this.filterKeyMpw});
        this.sortKeyMpw = '';
      }, err => {
        alert("Error: " + err.error.msg);
      }
    )
  }

  activateManpower(manpower): void {
    this.resourceService.activateManpower({id: manpower.id}).subscribe(
      response => {
        alert("Manpower " + manpower.title + " activated!");
        // this.ngOnInit();
        this.filterManpowerStatus({"value": this.filterKeyMpw});
        this.sortKeyMpw = '';
      }, err => {
        alert("Error: " + err.error.msg);
      }
    )
  }

  deactivateVenue(venue): void {
    this.resourceService.deactivateVenue({id: venue.id}).subscribe(
      response => {
        alert("Venue " + venue.title + " deactivated!");
        // this.ngOnInit();
        this.filterVenueStatus({"value": this.filterKeyVen});
        this.sortKeyVen = '';
      }, err => {
        alert("Error: " + err.error.msg);
      }
    )
  }

  activateVenue(venue): void {
    this.resourceService.activateVenue({id: venue.id}).subscribe(
      response => {
        alert("Venue " + venue.title + " activated!");
        // this.ngOnInit();
        this.filterVenueStatus({"value": this.filterKeyVen});
        this.sortKeyVen = '';
      }, err => {
        alert("Error: " + err.error.msg);
      }
    )
  }

  deactivateKnowledge(knowledge): void {
    this.resourceService.deactivateKnowledge({id: knowledge.id}).subscribe(
      response => {
        alert("Knowledge " + knowledge.title + " deactivated!");
        // this.ngOnInit();
        this.filterKnowledgeStatus({"value": this.filterKeyKno});
        this.sortKeyKno = '';
      }, err => {
        alert("Error: " + err.error.msg);
      }
    )
  }

  activateKnowledge(knowledge): void {
    this.resourceService.activateKnowledge({id: knowledge.id}).subscribe(
      response => {
        alert("Knowledge " + knowledge.title + " activated!");
        // this.ngOnInit();
        this.filterKnowledgeStatus({"value": this.filterKeyKno});
        this.sortKeyKno = '';
      }, err => {
        alert("Error: " + err.error.msg);
      }
    )
  }
}
