import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-project-resources',
  templateUrl: './project-resources.component.html',
  styleUrls: ['./project-resources.component.css']
})
export class ProjectResourcesComponent implements OnInit {

  projectId: any;
  project: any;
  
  isOwnerAdmin = false;
  user: any;

  resourceNeeds = [];
  contributions = [];

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

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private tokenStorageService: TokenStorageService) { }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.projectId = params.id;
      }
    );
    this.sortOptions = [
      {label: 'Date Newest to Oldest', value: '!updatedAt'},
      {label: 'Date Oldest to Newest', value: 'updatedAt'}
    ];
    this.filterStatusOptions = [
      {label: 'All', value:'all'},
      {label: 'In progress', value:'progress'},
      {label: 'Completed', value:'completed'}
    ];
    this.filterTypeOptions = [
      {label: 'All', value:'all'},
      {label: 'Item', value:'item'},
      {label: 'Manpower', value:'manpower'},
      {label: 'Venue', value:'venue'},
      {label: 'Money', value:'money'}
    ];

    this.user = this.tokenStorageService.getUser();

    await this.projectService.viewProject({id: this.projectId}).toPromise().then(
      res => this.project = res.data.targetProject
    )

    if(this.project.host == this.user.id) {
      this.isOwnerAdmin = true;
    } else {
      for(var i=0; i<this.project.admins.length; i++) {
        if(this.project.admins[i] == this.user.id) {
          this.isOwnerAdmin = true;
          break;
        }
      }
    }
    
    await this.projectService.getProjectResourceNeeds({id: this.projectId}).toPromise().then(
      res => this.resourceNeeds = res.data.resourceneeds
    )

    await this.projectService.getProjectContributions({id: this.projectId}).toPromise().then(
      res => this.contributions = res.data.contributions
    )
    console.log(this.resourceNeeds);
    console.log(this.contributions);
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
    if(value == 'progress') {
      for(var i=0; i<this.resourceNeeds.length; i++) {
        if(this.resourceNeeds[i].status == 'progress') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else if(value == 'completed') {
      for(var i=0; i<this.resourceNeeds.length; i++) {
        if(this.resourceNeeds[i].status == 'completed') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else {
      arr = this.resourceNeeds; 
    }

    let tempArr = [];
    if(this.filterKeyNeedType == 'item') {
      for(var i=0; i<arr.length; i++) {
        if(arr[i].type == 'item') {
          tempArr.push(arr[i]);
        }
      }
    } else if(this.filterKeyNeedType == 'manpower') {
      for(var i=0; i<arr.length; i++) {
        if(arr[i].type == 'manpower') {
          tempArr.push(arr[i]);
        }
      }
    } else if(this.filterKeyNeedType == 'venue') {
      for(var i=0; i<arr.length; i++) {
        if(arr[i].type == 'venue') {
          tempArr.push(arr[i]);
        }
      }
    } else if(this.filterKeyNeedType == 'money') {
      for(var i=0; i<arr.length; i++) {
        if(arr[i].type == 'money') {
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
    if(value == 'item') {
      for(var i=0; i<this.resourceNeeds.length; i++) {
        if(this.resourceNeeds[i].type == 'item') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else if(value == 'manpower') {
      for(var i=0; i<this.resourceNeeds.length; i++) {
        if(this.resourceNeeds[i].type == 'manpower') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else if(value == 'venue') {
      for(var i=0; i<this.resourceNeeds.length; i++) {
        if(this.resourceNeeds[i].type == 'venue') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else if(value == 'money') {
      for(var i=0; i<this.resourceNeeds.length; i++) {
        if(this.resourceNeeds[i].type == 'money') {
          arr.push(this.resourceNeeds[i]);
        }
      }
    } else {
      arr = this.resourceNeeds;
    }

    let tempArr = [];
    if(this.filterKeyNeeds == 'progress') {
      for(var i=0; i<arr.length; i++) {
        if(arr[i].status == 'progress') {
          tempArr.push(arr[i]);
        }
      }
    } else if(this.filterKeyNeeds == 'completed') {
      for(var i=0; i<arr.length; i++) {
        if(arr[i].status == 'completed') {
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
    if(value == 'item') {
      for(var i=0; i<this.contributions.length; i++) {
        if(this.contributions[i].resType == 'item') {
          arr.push(this.contributions[i]);
        }
      }
    } else if(value == 'manpower') {
      for(var i=0; i<this.contributions.length; i++) {
        if(this.contributions[i].resType == 'manpower') {
          arr.push(this.contributions[i]);
        }
      }
    } else if(value == 'venue') {
      for(var i=0; i<this.contributions.length; i++) {
        if(this.contributions[i].resType == 'venue') {
          arr.push(this.contributions[i]);
        }
      }
    } else if(value == 'money') {
      for(var i=0; i<this.contributions.length; i++) {
        if(this.contributions[i].resType == 'money') {
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
      desc: this.form.desc,
      resourceType: this.form.resourceType,
      total: this.form.total
    }

    this.projectService.createResourceNeed(formCreate).subscribe(
      response => {
        alert("Resource Need Created!");
        window.location.reload();
      }, 
      err => {
        alert("Error: " + err.error.msg);
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
      total: need.total,
      completion: 100
    }
    this.projectService.editResourceNeed(formComplete).subscribe(
      response => {
        alert("Resource need updated!");
        window.location.reload();
      },
      err => {
        alert("Error: " + err.error.msg);
      }
    )
  }

  editResourceNeed(): void {
    const formEdit = {
      id: this.updateForm.id,
      title: this.updateForm.title,
      desc: this.updateForm.desc,
      total: this.updateForm.total,
      completion: this.updateForm.completion
    }
    this.projectService.editResourceNeed(formEdit).subscribe(
      response => {
        alert("Resource need updated!");
        window.location.reload();
      },
      err => {
        alert("Error: " + err.error.msg);
      }
    )
  }

  deleteNeed(need): void {
    let r = confirm("Are you sure you want to delete this resource need?");
    if (r == true) {
      this.projectService.deleteResourceNeed({id: need.id}).subscribe(
        response => {
          alert("Resource need deleted!");
          window.location.reload();
        },
        err => {
          alert("Error: " + err.error.msg);
        }
      )
    } else {
      return;
    }
  }

  deleteObtained(need): void {

  }

}
