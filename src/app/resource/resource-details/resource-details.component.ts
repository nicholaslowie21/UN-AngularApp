import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-resource-details',
  templateUrl: './resource-details.component.html',
  styleUrls: ['./resource-details.component.css']
})
export class ResourceDetailsComponent implements OnInit {

  id: any;
  type: any;
  resource: any;
  owner: any;
  institutionOwner: any;
  isOwner = false;

  isDeleted = false;

  constructor(private route: ActivatedRoute, private tokenStorageService: TokenStorageService, 
    private resourceService: ResourceService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.id = params.id;
        this.type = params.type;
      }
    );
    
    if (this.type == 'item') {
      await this.resourceService.viewItemDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.item; this.owner = res.data.owner});
    } else if (this.type == 'manpower') {
      await this.resourceService.viewManpowerDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.manpower; this.owner = res.data.owner});
    } else if (this.type == 'venue') {
      await this.resourceService.viewVenueDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.venue; this.owner = res.data.owner});
    } else if (this.type == 'knowledge') {
      await this.resourceService.viewKnowledgeDetails({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.knowledge; 
          this.owner = res.data.userOwner; 
          this.institutionOwner = res.data.institutionOwner;
        }
      );
    }
    console.log(this.resource);
    console.log(this.owner);

    if (this.type != 'knowledge' && this.owner.username == this.tokenStorageService.getUser().username) {
      this.isOwner = true;
    } else if (this.type == 'knowledge') {
      this.owner = this.owner.concat(this.institutionOwner);
      for(var i=0; i<this.owner.length; i++) {
        if(this.owner[i].username == this.tokenStorageService.getUser().username) {
          this.isOwner = true;
        }
      }
      // for(var i=0; i<this.institutionOwner.length; i++) {
      //   if(this.institutionOwner[i].username == this.tokenStorageService.getUser().username) {
      //     this.isOwner = true;
      //   }
      // }
    }
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-7);
  }

  deactivateResource(): void {
    if (this.type == 'item') {
      this.resourceService.deactivateItem({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.item;
          alert("Item deactivated!");
        }, err => {
          alert("Error: " + err.error.msg);
        }
      );
    } else if (this.type == 'manpower') {
      this.resourceService.deactivateManpower({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.manpower;
          alert("Manpower deactivated!");
        }, err => {
          alert("Error: " + err.error.msg);
        }
      );
    } else if (this.type == 'venue') {
      this.resourceService.deactivateVenue({id: this.id}).toPromise().then(
       res => {
         this.resource = res.data.venue;
         alert("Venue deactivated!");
       }, err => {
         alert("Error: " + err.error.msg);
       }
      );
    } else if (this.type == 'knowledge') {
      this.resourceService.deactivateKnowledge({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.knowledge;
          alert("Knowledge deactivated!");
        }, err => {
          alert("Error: " + err.error.msg);
        }
      );
    }
  }

  activateResource(): void {
    if (this.type == 'item') {
      this.resourceService.activateItem({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.item;
          alert("Item activated!");
        }, err => {
          alert("Error: " + err.error.msg);
        }
      );
    } else if (this.type == 'manpower') {
      this.resourceService.activateManpower({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.manpower;
          alert("Manpower activated!");
        }, err => {
          alert("Error: " + err.error.msg);
        }
      );
    } else if (this.type == 'venue') {
      this.resourceService.activateVenue({id: this.id}).toPromise().then(
       res => {
         this.resource = res.data.venue;
         alert("Venue activated!");
       }, err => {
         alert("Error: " + err.error.msg);
       }
      );
    } else if (this.type == 'knowledge') {
      this.resourceService.activateKnowledge({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.knowledge;
          alert("Knowledge activated!");
        }, err => {
          alert("Error: " + err.error.msg);
        }
      );
    }
  }

  deleteResource(): void {
    let r = confirm("Are you sure you want to delete this resource?");
    if (r == true) {
      if (this.type == 'item') {
        this.resourceService.deleteItem({id: this.id}).toPromise().then(
          res => {
            this.isDeleted = true;
          }, err => {
            alert("Error: " + err.error.msg);
          }
        );
      } else if (this.type == 'manpower') {
        this.resourceService.deleteManpower({id: this.id}).toPromise().then(
          res => {
            this.isDeleted = true;
          }, err => {
            alert("Error: " + err.error.msg);
          }
        );
      } else if (this.type == 'venue') {
        this.resourceService.deleteVenue({id: this.id}).toPromise().then(
         res => {
          this.isDeleted = true;
         }, err => {
           alert("Error: " + err.error.msg);
         }
        );
      } else if (this.type == 'knowledge') {
        this.resourceService.deleteKnowledge({id: this.id}).toPromise().then(
          res => {
            this.isDeleted = true;
          }, err => {
            alert("Error: " + err.error.msg);
          }
        );
      }
    } else {
      return;
    }
  }

}
