import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';
import { UserService } from '../../services/user.service';
import { InstitutionService } from '../../services/institution.service';
import { ResourceService } from '../../services/resource.service';
import { saveAs } from 'file-saver';
import { Galleria } from 'primeng/galleria';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../../services/project.service';
import { MarketplaceService } from '../../services/marketplace.service';

@Component({
  selector: 'app-resource-details',
  templateUrl: './resource-details.component.html',
  styleUrls: ['./resource-details.component.css'],
  providers: [MessageService]
})
export class ResourceDetailsComponent implements OnInit {

  id: any;
  type: any;
  resource: any;
  attachmentPath: any;
  tempStrings: any;
  startIndexFound: boolean;
  owner: any;
  institutionOwner: any;
  isOwner = false;

  isDeleted = false;

  checked = false;

  venueImages = [];
  showThumbnails: boolean;
  fullscreen: boolean = false;
  activeIndex: number = 0;
  onFullScreenListener: any;
  @ViewChild('galleria') galleria: Galleria;
  responsiveOptions:any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
  ];

  form: any = {};
  myProjects: any[];
  selectedProjectId: any;
  projectSelected: boolean = false;
  filterKeyProject = 'Select a Project';
  resourceNeeds: any[];
  selectedResourceNeedId: any;

  pendingResourceReqs: any[];
  acceptedResourceReqs: any[];
  pendingProjectReqs: any[];
  acceptedProjectReqs: any[];
  declinedProjectReqs: any[];
  cancelledProjectReqs: any[];

  suggestedProjects: any[];
  autogenerateYes: boolean = false;

  constructor(private route: ActivatedRoute, private tokenStorageService: TokenStorageService, 
    private userService: UserService, private institutionService: InstitutionService, private projectService: ProjectService,
    private resourceService: ResourceService, private marketplaceService: MarketplaceService, private messageService: MessageService) { }

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
      for (let i = 0; i < this.resource.imgPath.length; i++) {
        this.venueImages[i] = "https://localhost:8080" + this.resource.imgPath[i];
      }
    } else if (this.type == 'knowledge') {
      await this.resourceService.viewKnowledgeDetails({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.knowledge; 
          this.owner = res.data.userOwner; 
          this.institutionOwner = res.data.institutionOwner;
          this.attachmentPath = res.data.knowledge.attachment;
        }
      );
    }
    console.log(this.resource);
    console.log(this.owner);

    if (this.type == 'knowledge') {
      this.startIndexFound = false;
      var startIndex = 0;
      var endIndex = 0;
      var extensionIndex = 0;
      for (let i = this.attachmentPath.length; i > 0; i--) {
        if (this.attachmentPath[i] == '.') {
          extensionIndex = i;
        }
        else if (this.attachmentPath[i] == '-') {
          endIndex = i;
        } else if (this.attachmentPath[i] == '/' && !this.startIndexFound) {
          startIndex = i;
          this.startIndexFound = true;
        }
      }
      this.attachmentPath = this.attachmentPath.slice(startIndex+1, endIndex) + this.attachmentPath.slice(extensionIndex);
    }

    if (this.type != 'knowledge' && this.owner.username == this.tokenStorageService.getUser().username) {
      this.isOwner = true;
    } else if (this.type == 'knowledge') {
      this.owner = this.owner.concat(this.institutionOwner);
      for(var i=0; i<this.owner.length; i++) {
        if(this.owner[i].username == this.tokenStorageService.getUser().username) {
          this.isOwner = true;
        }
      }
    }

    // retrieve current user's projects
    await this.marketplaceService.getUserProjects({id: this.tokenStorageService.getUser().id, accountType: this.tokenStorageService.getAccountType()}).toPromise().then(
      res => this.myProjects = res.data.theProjects
    );
    // console.log(this.myProjects.length);

    // retrieve pending and accepted resource requests
    await this.marketplaceService.viewResIncomingResReq({reqStatus: 'pending', id: this.id, resType: this.type}).toPromise().then(
      res => {this.pendingResourceReqs = res.data.resourceResourceReqs}
    );
    await this.marketplaceService.viewResIncomingResReq({reqStatus: 'accepted', id: this.id, resType: this.type}).toPromise().then(
      res => {this.acceptedResourceReqs = res.data.resourceResourceReqs}
    );
    await this.marketplaceService.viewResOutgoingProjReq({reqStatus: 'pending', id: this.id}).toPromise().then(
      res => {this.pendingProjectReqs = res.data.resourceProjectReqs}
    );
    await this.marketplaceService.viewResOutgoingProjReq({reqStatus: 'accepted', id: this.id}).toPromise().then(
      res => {this.acceptedProjectReqs = res.data.resourceProjectReqs}
    );

    // retrieve suggested projects (resource needs) for this resource
    await this.marketplaceService.getResourceNeedSuggestion({id: this.id, type: this.type}).toPromise().then(
      res => {this.suggestedProjects = res.data.resourceneedSuggestion}
    );

  }

  checkStatus(): boolean {
    if (this.resource.status === 'active') {
      return true;
    } else {
      return false;
    }
  }

  handleChangeChecked(e) {
    let isChecked = e.checked;
    if(isChecked)
      this.activateResource();
    else 
      this.deactivateResource();
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  deactivateResource(): void {
    if (this.type == 'item') {
      this.resourceService.deactivateItem({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.item;
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Item resource deactivated!'});
        }, err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else if (this.type == 'manpower') {
      this.resourceService.deactivateManpower({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.manpower;
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Manpower resource deactivated!'});
        }, err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else if (this.type == 'venue') {
      this.resourceService.deactivateVenue({id: this.id}).toPromise().then(
       res => {
         this.resource = res.data.venue;
         this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Venue resource deactivated!'});
       }, err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
       }
      );
    } else if (this.type == 'knowledge') {
      this.resourceService.deactivateKnowledge({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.knowledge;
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Knowledge resource deactivated!'});
        }, err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    }
  }

  activateResource(): void {
    if (this.type == 'item') {
      this.resourceService.activateItem({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.item;
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Item resource activated!'});
        }, err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else if (this.type == 'manpower') {
      this.resourceService.activateManpower({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.manpower;
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Manpower resource activated!'});
        }, err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else if (this.type == 'venue') {
      this.resourceService.activateVenue({id: this.id}).toPromise().then(
       res => {
         this.resource = res.data.venue;
         this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Venue resource activated!'});
       }, err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
       }
      );
    } else if (this.type == 'knowledge') {
      this.resourceService.activateKnowledge({id: this.id}).toPromise().then(
        res => {
          this.resource = res.data.knowledge;
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Knowledge resource activated!'});
        }, err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
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

  downloadAttachment(filePath) {
    this.resourceService.getAttachmentFile(filePath).subscribe(
      response => {
        this.tempStrings = filePath.split("/");
        // saveAs(response, this.tempStrings[this.tempStrings.length-1]);
        saveAs(response, this.attachmentPath);
        // this.reloadPage();
      },
      err => {
        alert('Something went wrong while downloading the file. Please try again!')
      }
    )
  }

  reloadPage(): void {
    window.location.reload();
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
      if (this.resourceNeeds[i].type == this.type && this.resourceNeeds[i].completion != 100) {
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
        resourceId: this.id,
        projectId: this.selectedProjectId,
        resType: this.type,
        desc: this.form.desc
      };
      this.marketplaceService.requestResourceAuto(formCreate).subscribe(
        response => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource request and resource need created!'});
          window.location.reload();
        }, 
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      // submit request for selected resource need
      const formCreate = {
        needId: this.selectedResourceNeedId,
        resourceId: this.id,
        resType: this.type,
        desc: this.form.desc
      };

      this.marketplaceService.requestResource(formCreate).subscribe(
        response => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource request created!'});
          window.location.reload();
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
        resourceId: this.id,
        projectId: this.selectedProjectId,
        desc: this.form.desc
      };
      this.marketplaceService.useKnowledgeResourceAuto(formCreate).subscribe(
        response => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource request and resource need created!'});
          window.location.reload();
        }, 
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      const formCreate = {
        needId: this.selectedResourceNeedId,
        resourceId: this.id,
        desc: this.form.desc
      };

      this.marketplaceService.useKnowledgeResource(formCreate).subscribe(
        response => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource request created!'});
          window.location.reload();
        }, 
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    }
  }

  acceptResourceReq(reqId): void {
    let r = confirm("Are you sure you want to accept this request?");
    if (r == true) {
    this.marketplaceService.acceptResourceReq({id: reqId}).subscribe(
      response => {
        this.messageService.add({key:'toastMsg', severity:'success', summary:'Success', detail:'Resource request accepted!'});
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

  declineResourceReq(reqId): void {
    let r = confirm("Are you sure you want to decline this request?");
    if (r == true) {
      this.marketplaceService.declineResourceReq({id: reqId}).subscribe(
        response => {
          this.messageService.add({key:'toastMsg', severity:'success', summary:'Success', detail:'Resource request declined!'});
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

  cancelResourceReq(reqId): void {
    let r = confirm("Are you sure you want to cancel this request?");
    if (r == true) {
      this.marketplaceService.cancelResourceReq({id: reqId}).subscribe(
        response => {
          this.messageService.add({key:'toastMsg', severity:'success', summary:'Success', detail:'Resource request cancelled!'});
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

  // below is all code for venue images galleria
  onThumbnailButtonClick() {
    this.showThumbnails = !this.showThumbnails;
  }

  toggleFullScreen() {
    if (this.fullscreen) {
      this.closePreviewFullScreen();
    }
    else {
      this.openPreviewFullScreen();
    }
  }

  openPreviewFullScreen() {
    let elem = this.galleria.element.nativeElement.querySelector(".p-galleria");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
    else if (elem['mozRequestFullScreen']) { /* Firefox */
      elem['mozRequestFullScreen']();
    }
    else if (elem['webkitRequestFullscreen']) { /* Chrome, Safari & Opera */
      elem['webkitRequestFullscreen']();
    }
    else if (elem['msRequestFullscreen']) { /* IE/Edge */
      elem['msRequestFullscreen']();
    }
  }

  onFullScreenChange() {
    this.fullscreen = !this.fullscreen;
  }

  closePreviewFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    else if (document['mozCancelFullScreen']) {
      document['mozCancelFullScreen']();
    }
    else if (document['webkitExitFullscreen']) {
      document['webkitExitFullscreen']();
    }
    else if (document['msExitFullscreen']) {
      document['msExitFullscreen']();
    }
  }

  bindDocumentListeners() {
    this.onFullScreenListener = this.onFullScreenChange.bind(this);
    document.addEventListener("fullscreenchange", this.onFullScreenListener);
    document.addEventListener("mozfullscreenchange", this.onFullScreenListener);
    document.addEventListener("webkitfullscreenchange", this.onFullScreenListener);
    document.addEventListener("msfullscreenchange", this.onFullScreenListener);
  }

  unbindDocumentListeners() {
    document.removeEventListener("fullscreenchange", this.onFullScreenListener);
    document.removeEventListener("mozfullscreenchange", this.onFullScreenListener);
    document.removeEventListener("webkitfullscreenchange", this.onFullScreenListener);
    document.removeEventListener("msfullscreenchange", this.onFullScreenListener);
    this.onFullScreenListener = null;
  }

  ngOnDestroy() {
    this.unbindDocumentListeners();
  }

  galleriaClass() {
    return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
  }

  fullScreenIcon() {
    return `pi ${this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'}`;
  }

}
