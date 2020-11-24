import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import { PaidResourceService } from '../../services/paid-resource.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { Galleria } from 'primeng/galleria';

@Component({
  selector: 'app-paid-resource-details',
  templateUrl: './paid-resource-details.component.html',
  styleUrls: ['./paid-resource-details.component.css'],
  providers: [MessageService]
})
export class PaidResourceDetailsComponent implements OnInit {

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
  showThumbnails: boolean;
  fullscreen: boolean = false;
  activeIndex: number = 0;
  onFullScreenListener: any;

  id: any;
  isOwner = false;
  resource: any;
  resourceImages = [];


  constructor(private route: ActivatedRoute, private tokenStorageService: TokenStorageService, private messageService: MessageService,
    private paidResourceService: PaidResourceService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.id = params.id;
      }
    );

    await this.paidResourceService.getPaidResourceDetails({id: this.id}).toPromise().then(
      res => this.resource = res.data.paidresource
    );

    for(var i=0; i<this.resource.imgPath.length; i++) {
      this.resourceImages[i] = "https://localhost:8080" + this.resource.imgPath[i];
    }

    console.log(this.resource);
    console.log(this.resourceImages);

    let username = this.tokenStorageService.getUser().username;
    console.log(this.resource.ownerUsername);
    if(this.resource.ownerUsername == username) {
      this.isOwner = true;
    }
  }

  handleChangeChecked(e) {
    let isChecked = e.checked;
    if(isChecked)
      this.updateStatus('active');
    else 
    this.updateStatus('inactive');
  }

  updateStatus(status): void {
    let r = true;
    if(status == 'deleted') {
      r = false;
      r = confirm("Are you sure you want to delete this resource?");
    }
    if(r == true) {
      this.paidResourceService.updatePaidResourceStatus({id: this.id, status: status}).subscribe(
        res => {
          this.ngOnInit();
          if(status == 'active') {
            this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource activated!'});
          } else if(status == 'inactive') {
            this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource deactivated!'});
          } else {
            this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Resource deleted!'});
          }
        }, err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
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
