import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import { ResourceService } from '../../services/resource.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-my-resources',
  templateUrl: './my-resources.component.html',
  styleUrls: ['./my-resources.component.css'],
  providers: [MessageService]
})
export class MyResourcesComponent implements OnInit {

  user: any;
  isIndividual = false;
  items: any = [];
  knowledges: any = [];
  manpowers: any = [];
  venues: any = [];

  sortOptions: any = [];

  sortOrder: number;

  sortField: string;

  constructor(private tokenStorageService: TokenStorageService, private resourceService: ResourceService,
    private messageService: MessageService) { }

  async ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    this.isIndividual = this.user.role;

    this.sortOptions = [
      {label: 'Date Newest to Oldest', value: '!updatedAt'},
      {label: 'Date Oldest to Newest', value: 'updatedAt'}
    ];

    if(this.isIndividual) {
      // this.items = await this.resourceService.getUserPrivateItem().toPromise().then(res => this.items=res.data.items);
      this.resourceService.getUserPrivateItem().toPromise().then(res => this.items = res.data.items);
      this.resourceService.getUserPrivateManpower().toPromise().then(res => this.manpowers = res.data.manpowers);
      this.resourceService.getUserPrivateKnowledge().toPromise().then(res => this.knowledges = res.data.knowledges);
      this.resourceService.getUserPrivateVenue().toPromise().then(res => this.venues = res.data.venues);
    } else {
      this.resourceService.getInstitutionPrivateItem().toPromise().then(res => this.items = res.data.items);
      this.resourceService.getInstitutionPrivateKnowledge().toPromise().then(res => this.knowledges = res.data.knowledges);
      this.resourceService.getInstitutionPrivateVenue().toPromise().then(res => this.venues = res.data.venues);
    }
    console.log(this.items);
    console.log(this.manpowers);
    console.log(this.knowledges);
    console.log(this.venues);
  }

  onSortChange(event) {
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

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-7);
  }

  deactivateItem(item): void {
    this.resourceService.deactivateItem({id: item.id}).subscribe(
      response => {
        alert("Item " + item.title + " deactivated!");
        // this.messageService.add({key: 'item1', severity:'success', summary: 'Success!', detail: 'Item deactivated'});
        this.ngOnInit();
      }, err => {
        alert("Error: " + err.error.msg);
      }
    )
  }
  
  activateItem(item): void {
    this.resourceService.activateItem({id: item.id}).subscribe(
      response => {
        alert("Item " + item.title + " activated!");
        this.ngOnInit();
      }, err => {
        alert("Error: " + err.error.msg);
      }
    )
  }

  loadUserItem(): Promise<any> {
    return this.resourceService.getUserPrivateItem().toPromise();
  }

}
