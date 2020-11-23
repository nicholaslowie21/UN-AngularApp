import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { InstitutionService } from '../../services/institution.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ResourceService } from '../../services/resource.service';
import { Galleria } from 'primeng/galleria';
import { MessageService } from 'primeng/api';
import { _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { PaidResourceService } from 'src/app/services/paid-resource.service';

@Component({
  selector: 'app-edit-resource-details',
  templateUrl: './edit-resource-details.component.html',
  styleUrls: ['./edit-resource-details.component.css'],
  providers: [MessageService]
})
export class EditResourceDetailsComponent implements OnInit {

  id: any;
  type: any;
  resource: any;
  knowType: any;
  todayDate = new Date();
  isUpdateSuccessful = false;
  errorMessage = '';

  itemImage: any;
  isUploadItemPicSuccessful = false;
  toBeAdded: FileList;
  isUploadPicSuccessful = false;
  errorMsgUploadPic = '';
  // array of 10 booleans for max 10 pics
  toBeDeleted: boolean[] = [false, false, false, false, false, false, false, false, false, false];
  isDeletePicSuccessful;
  errorMsgDeletePic = '';

  attachmentPath: any;
  startIndexFound: boolean;

  attachment: any;
  isUploadAttachmentSuccessful = false;
  errorMsgUploadAttachment = '';

  tempUser: any;
  userOwners: any;
  institutionOwners: any;
  keyword = '';
  searchResults: any;
  isSearchSuccessful = false;
  errorMsgSearch = '';
  isAddSuccessful = false;
  isDelSuccessful = false;
  errorMsgAdd = '';
  errorMsgDel = '';

  emptyPlaceholder = [];

  countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

  // containing filenames of the images
  imgFileNames: any[];

  // for venue images galleria
  images: any[];
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

  constructor(private route: ActivatedRoute, private institutionService: InstitutionService, private paidResourceService: PaidResourceService,
    private resourceService: ResourceService, private tokenStorageService: TokenStorageService, private messageService: MessageService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.id = params.id;
        this.type = params.type;
      }
    );
    
    if (this.type == 'item') {
      await this.resourceService.viewItemDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.item, this.images = res.data.item.imgPath});
      for (let i = 0; i < this.images.length; i++) {
        this.images[i] = "https://localhost:8080" + this.images[i];
      }
      this.generateFilenames();
    } else if (this.type == 'manpower') {
      await this.resourceService.viewManpowerDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.manpower});
    } else if (this.type == 'venue') {
      await this.resourceService.viewVenueDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.venue, this.images = res.data.venue.imgPath});
      for (let i = 0; i < this.images.length; i++) {
        this.images[i] = "https://localhost:8080" + this.images[i];
      }
      console.log(this.images);
      this.generateFilenames();
      console.log(this.imgFileNames);
      // this.emptyPlaceholder = new Array(10 - this.resource.imgPath.length);
      // console.log(this.emptyPlaceholder);
    } else if (this.type == 'knowledge') {
      await this.resourceService.viewKnowledgeDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.knowledge, this.userOwners = res.data.userOwner, this.institutionOwners = res.data.institutionOwner, this.attachmentPath = res.data.knowledge.attachment, this.knowType = res.data.knowledge.knowType});
    } else if (this.type == 'paid') {
      await this.paidResourceService.getPaidResourceDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.paidresource, this.images = res.data.paidresource.imgPath});
      for (let i = 0; i < this.images.length; i++) {
        this.images[i] = "https://localhost:8080" + this.images[i];
      }
      console.log(this.images);
      this.generateFilenames();
    }

    if (this.type == 'knowledge') {
      console.log("before:" + this.attachmentPath);
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
      console.log("after: " + this.attachmentPath);
    }
    this.bindDocumentListeners();
  }

  selectItemImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.itemImage = file;
    }
  }

  // onSubmitItemImage(): void {
  //   if (this.itemImage == null) {
  //     this.errorMsgUploadPic = 'Choose a file!';
  //     this.isUploadItemPicSuccessful = false;
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("itemId", this.id);
  //   formData.append("itemPic", this.itemImage);

  //   this.resourceService.uploadItemPicture(formData).subscribe(
  //     response => {
  //       this.isUploadItemPicSuccessful = true;
  //       this.reloadPage();
  //     },
  //     err => {
  //       this.errorMsgUploadPic = err.error.msg;
  //       this.isUploadItemPicSuccessful = false;
  //     }
  //   )
  // }

  updateCheckedImages(x, event) {
    this.toBeDeleted[x] = event.target.checked;
    console.log(x);
  }

  deleteImages() {
    var indexToDelete = [];
    for (let i = 0; i < this.toBeDeleted.length; i++) {
      if (this.toBeDeleted[i]) {
        indexToDelete.push(i);
      }
    }
    // if no pictures selected, alert user
    if (indexToDelete.length == 0) {
      this.errorMsgDeletePic = "No picture selected!";
      this.isDeletePicSuccessful = false;
    } else {
      if (this.type == 'item') {
        this.resourceService.deleteItemPicture({itemId: this.resource.id, indexes: indexToDelete}).subscribe(
          response => {
            this.isDeletePicSuccessful = true;
            this.reloadPage();
          },
          err => {
            this.errorMsgDeletePic = err.error.msg;
            this.isDeletePicSuccessful = false;
          }
        );
      } else if (this.type == 'venue') {
        this.resourceService.deleteVenuePicture({venueId: this.resource.id, indexes: indexToDelete}).subscribe(
          response => {
            this.isDeletePicSuccessful = true;
            this.reloadPage();
          },
          err => {
            this.errorMsgDeletePic = err.error.msg;
            this.isDeletePicSuccessful = false;
          }
        );
      } else if (this.type == 'paid') {
        this.paidResourceService.deletePaidResourcePicture({paidResourceId: this.resource.id, indexes: indexToDelete}).subscribe(
          response => {
            this.isDeletePicSuccessful = true;
            this.reloadPage();
          },
          err => {
            this.errorMsgDeletePic = err.error.msg;
            this.isDeletePicSuccessful = false;
          }
        );
      }
    }
  }

  selectImages(event): void {
    this.toBeAdded = event.target.files;
  }

  onSubmitImages(): void {
    if (this.toBeAdded.length == 0) {
      this.errorMsgUploadPic = 'Choose a file!';
      this.isUploadPicSuccessful = false;
      return;
    }

    const formData = new FormData();
    if (this.type == 'venue') {
      formData.append("venueId", this.id);
      for (let i = 0; i < this.toBeAdded.length; i++) {
        formData.append("venuePics", this.toBeAdded[i]);
      }
      this.resourceService.uploadVenuePicture(formData).subscribe(
        response => {
          this.isUploadPicSuccessful = true;
          this.reloadPage();
        },
        err => {
          this.errorMsgUploadPic = err.error.msg;
          this.isUploadPicSuccessful = false;
        }
      );
    } else if (this.type == 'item') {
      formData.append("itemId", this.id);
      for (let i = 0; i < this.toBeAdded.length; i++) {
        formData.append("itemPics", this.toBeAdded[i]);
      }
      this.resourceService.uploadItemPicture(formData).subscribe(
        response => {
          this.isUploadPicSuccessful = true;
          this.reloadPage();
        },
        err => {
          this.errorMsgUploadPic = err.error.msg;
          this.isUploadPicSuccessful = false;
        }
      );
    } else if (this.type == 'paid') {
      formData.append("paidResourceId", this.id);
      for (let i = 0; i < this.toBeAdded.length; i++) {
        formData.append("paidResPics", this.toBeAdded[i]);
      }
      this.paidResourceService.uploadPaidResourcePicture(formData).subscribe(
        response => {
          this.isUploadPicSuccessful = true;
          this.reloadPage();
        },
        err => {
          this.errorMsgUploadPic = err.error.msg;
          this.isUploadPicSuccessful = false;
        }
      );
    }
  }

  selectAttachment(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.attachment = file;
    }
  }

  onSubmitAttachment(): void {
    if (this.attachment == null) {
      this.errorMsgUploadAttachment = 'Choose a file!';
      this.isUploadAttachmentSuccessful = false;
      return;
    }

    const formData = new FormData();
    formData.append("knowledgeId", this.id);
    formData.append("attachment", this.attachment);

    this.resourceService.uploadKnowledgeAttachment(formData).subscribe(
      response => {
        this.isUploadAttachmentSuccessful = true;
        this.reloadPage();
      },
      err => {
        this.errorMsgUploadAttachment = err.error.msg;
        this.isUploadAttachmentSuccessful = false;
      }
    )
  }

  searchUsers(): void {
    if(this.keyword.length == 0) {
      this.isSearchSuccessful = false;
      this.errorMsgSearch = 'Please enter a username';
      return;
    }
    this.institutionService.searchUsers({username: this.keyword}).subscribe(
      response => {
        this.searchResults = response.data.users;
        if (this.searchResults.length == 0) {
          this.isSearchSuccessful = false;
          this.errorMsgSearch = 'No users found';
        } else {
          this.isSearchSuccessful = true;
        }
      },
      err => {
        this.errorMsgSearch = err.error.msg;
        this.isSearchSuccessful = false;
      }
    )
    console.log(this.errorMsgSearch);
  }

  addOwner(user): void {
    this.resourceService.addKnowledgeOwner({knowledgeId: this.resource.id, userId: user.id}).subscribe(
      response => {
        this.isAddSuccessful = true;
        this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'User ' + user.username + ' is now a co-owner of this resource'});
        this.ngOnInit();
        // this.reloadPage();
      }, err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        this.errorMsgAdd = err.error.msg;
        this.isAddSuccessful = false;
      }
    )
  }

  deleteOwner(user): void {
    let r = confirm("Are you sure you want to remove this owner?");
    if (r == true) {
      if (this.isUserOwner(user)) {
        this.resourceService.deleteKnowledgeOwner({knowledgeId: this.resource.id, userId: user.id, userType: "user"}).subscribe(
          response => {
            this.isDelSuccessful = true;
            this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'User ' + user.username + ' is no longer a co-owner of this resource'});
            this.ngOnInit();
            // this.reloadPage();
          }, err => {
            this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
            this.errorMsgDel = err.error.msg;
            this.isDelSuccessful = false;
          }
        )
      } else { // this user is an institution
        this.resourceService.deleteKnowledgeOwner({knowledgeId: this.resource.id, userId: user.id, userType: "institution"}).subscribe(
          response => {
            this.isDelSuccessful = true;
            this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'User ' + user.username + ' is no longer a co-owner of this resource'});
            this.ngOnInit();
            // this.reloadPage();
          }, err => {
            this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
            this.errorMsgDel = err.error.msg;
            this.isDelSuccessful = false;
          }
        )
      }
    } else {
      return;
    }
  }

  // checks if current user is still an owner of this resource
  stillOwner(): boolean {
    if (this.type == 'knowledge') {
      for(var i = 0; i < this.userOwners.length; i++) {
        if (this.userOwners[i].username == this.tokenStorageService.getUser().username) {
          return true;
        }
      }
      for(var i = 0; i < this.institutionOwners.length; i++) {
        if (this.institutionOwners[i].username == this.tokenStorageService.getUser().username) {
          return true;
        }
      }
      return false;
    } else { // item, resource, manpower
      if (this.resource.owner == this.tokenStorageService.getUser().id) {
        return true;
      } else {
        return false;
      }
    }
  }

  isUserOwner(user): boolean {
    for(var i = 0; i < this.userOwners.length; i++) {
      if(this.userOwners[i].username == user.username) {
        return true;
      }
    }
    return false;
  }

  isInstitutionOwner(user): boolean {
    for(var i = 0; i < this.institutionOwners.length; i++) {
      if(this.institutionOwners[i].username == user.username) {
        return true;
      }
    }
    return false;
  }

  onSubmit(): void {
    console.log(this.id);
    if (this.type == 'paid') {
      const formUpdatePaid = {
        id: this.id,
        title: this.resource.title,
        desc: this.resource.desc,
        category: this.resource.category,
        country: this.resource.country,
        price: this.resource.price,
      }
      this.paidResourceService.updatePaidResource(formUpdatePaid).subscribe(
        response => {
          this.isUpdateSuccessful = true;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.isUpdateSuccessful = false;
        }
      );
    } else if (this.type == 'item') {
      const formUpdateItem = {
        id: this.id,
        title: this.resource.title,
        desc: this.resource.desc,
        country: this.resource.country
      }
      this.resourceService.updateItem(formUpdateItem).subscribe(
        response => {
          this.isUpdateSuccessful = true;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.isUpdateSuccessful = false;
        }
      );
    } else if (this.type == 'knowledge') {
      const formUpdateKnowledge = {
        id: this.id,
        knowType: this.knowType,
        patentNum: '',
        expiry: '',
        issn: '',
        doi: '',
        issueDate: '',
        title: this.resource.title,
        desc: this.resource.desc,
        link: this.resource.link || ''
      }

      if (this.knowType == 'patent') {
        formUpdateKnowledge.patentNum = this.resource.patentNum;
        formUpdateKnowledge.expiry = this.resource.expiry;

      } else if (this.knowType == 'publication') {
        formUpdateKnowledge.issn = this.resource.issn || '';
        formUpdateKnowledge.doi = this.resource.doi || '';
        formUpdateKnowledge.issueDate = this.resource.issueDate || '';
      }
      
      this.resourceService.updateKnowledge(formUpdateKnowledge).subscribe(
        response => {
          this.isUpdateSuccessful = true;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.isUpdateSuccessful = false;
        }
      )
    } else if (this.type == 'manpower') {
      const formUpdateManpower = {
        id: this.id,
        title: this.resource.title,
        desc: this.resource.desc,
        country: this.resource.country
      }
      this.resourceService.updateManpower(formUpdateManpower).subscribe(
        response => {
          this.isUpdateSuccessful = true;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.isUpdateSuccessful = false;
        }
      )
    } else if (this.type == 'venue') {
      const formUpdateVenue = {
        id: this.id,
        title: this.resource.title,
        desc: this.resource.desc,
        address: this.resource.address,
        country: this.resource.country
      }
      this.resourceService.updateVenue(formUpdateVenue).subscribe(
        response => {
          this.isUpdateSuccessful = true;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.isUpdateSuccessful = false;
        }
      )
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  generateFilenames(): void {
    for (let i = 0; i < this.images.length; i++) {
      var currFileName = this.images[i];
      this.startIndexFound = false;
      var startIndex = 0;
      var endIndex = 0;
      var extensionIndex = 0;
      for (let j = currFileName.length; j > 0; j--) {
        if (currFileName[j] == '.') {
          extensionIndex = j;
        }
        else if (currFileName[j] == '-') {
          endIndex = j;
        } else if (currFileName[j] == '/' && !this.startIndexFound) {
          startIndex = j;
          this.startIndexFound = true;
        }
      }
      var newFileName = currFileName.slice(startIndex+1, endIndex) + currFileName.slice(extensionIndex);
      this.imgFileNames.push(newFileName);
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
