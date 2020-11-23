import { Component, OnInit } from '@angular/core';
import { MappingService } from '../../services/mapping.service';
import { AdminService } from '../../services/admin.service';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-admin-data-management',
  templateUrl: './admin-data-management.component.html',
  styleUrls: ['./admin-data-management.component.css'],
  providers: [MessageService]
})
export class AdminDataManagementComponent implements OnInit {

  fileUser: any;
  fileInstitution: any;

  claims = [];
  tempStrings: any;

  userTypeOptions = [];
  filterKeyType = '';

  constructor(private mappingService: MappingService, private adminService: AdminService, private messageService: MessageService) { }

  async ngOnInit() {
    await this.adminService.getClaims().toPromise().then(
      res => this.claims = res.data.claims
    );

    console.log(this.claims);

    this.userTypeOptions= [
      {label: 'All', value: 'all'},
      {label: 'Individual', value: 'individual'},
      {label: 'Institution', value: 'institution'}
    ]
  }

  selectFileUser(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileUser = file;
    }
  }

  selectFileInstitution(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileInstitution = file;
    }
  }

  uploadUser(): void {
    if(this.fileUser == null) {
      this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:'Choose a file!'});
    }

    const formData = new FormData();
    formData.append('csvUser', this.fileUser);

    this.mappingService.uploadUserCSV(formData).subscribe(
      res => {
        this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:res.msg});
        window.location.reload();
      },
      err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    );
  }

  uploadInstitution(): void {
    if(this.fileInstitution == null) {
      this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:'Choose a file!'});
    }

    const formData = new FormData();
    formData.append('csvInstitution', this.fileInstitution);

    this.mappingService.uploadInstitutionCSV(formData).subscribe(
      res => {
        this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:res.msg});
        window.location.reload();
      },
      err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    );
  }

  updateClaim(id, action): void {
    let r;
    if(action == 'accepted') {
      r = confirm('Are you sure you want to accept this claim?');
    } else {
      r = confirm('Are you sure you want to decline this claim?');
    }
    if(r == true) {
      this.adminService.validateClaim({id: id, action: action}).subscribe(
        res => {
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Claim ' + action + ' successfully!'});
          this.ngOnInit();
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  downloadAttachment(filePath) {
    this.adminService.getAttachmentFile(filePath).subscribe(
      response => {
        this.tempStrings = filePath.split("/");
        saveAs(response, this.tempStrings[this.tempStrings.length-1]);
      },
      err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:'Something went wrong while downloading the file. Please try again!'});
      }
    )
  }

  async onFilterType(event) {
    let value = event.value;
    await this.ngOnInit();
    let arr = [];
    if(value == 'all') {
      return;
    } else if(value == 'individual') {
      for(var i=0; i<this.claims.length; i++) {
        if(this.claims[i].accountType == 'user') {
          arr.push(this.claims[i]);
        }
      }
    } else {
      for(var i=0; i<this.claims.length; i++) {
        if(this.claims[i].accountType == 'institution') {
          arr.push(this.claims[i]);
        }
      }
    }
    this.claims = arr;
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

}
