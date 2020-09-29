import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';
import { ResourceService } from '../../services/resource.service';
import { saveAs } from 'file-saver';
import { Galleria } from 'primeng/galleria';

@Component({
  selector: 'app-resource-details',
  templateUrl: './resource-details.component.html',
  styleUrls: ['./resource-details.component.css']
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
