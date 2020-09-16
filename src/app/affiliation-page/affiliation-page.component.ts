import { Component, OnInit } from '@angular/core';
import { InstitutionService } from '../services/institution.service';
import { TokenStorageService } from '../services/token-storage.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-affiliation-page',
  templateUrl: './affiliation-page.component.html',
  styleUrls: ['./affiliation-page.component.css']
})
export class AffiliationPageComponent implements OnInit {

  isInstitution: any;
  institution: any;
  file: any;
  isUploadSuccessful: any;
  errorMsgUpload = '';

  members: any;
  keyword = '';
  searchResults: any;
  isSearchSuccessful: any;
  errorMsgSearch = '';

  isAddSuccessful: any;
  errorMsgAdd = '';

  isDelSuccessful: any;
  errorMsgDel = '';

  constructor(private institutionService: InstitutionService, private tokenStorageService: TokenStorageService,
      private http: HttpClient) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getAccountType() != "user") {
      this.isInstitution = true;
      this.institution = this.tokenStorageService.getUser();
      this.institutionService.getAffiliatedUsers({id: this.institution.id}).subscribe(
        response => {
          this.members = response.data.members;
        }
      );
    }
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file = file;
    }
  }

  uploadCSV(): void {
    const formData = new FormData();
    formData.append('CSV', this.file);

    this.institutionService.uploadAffiliationCSV(formData).subscribe(
      response => {
        this.tokenStorageService.saveUser(response.data.user);
        this.isUploadSuccessful = true;
        this.reloadPage();
      }, 
      err => {
        this.errorMsgUpload = err.error.msg;
      }
    )
  }

  searchUsers(): void {
    if(this.keyword.length == 0) {
      this.isSearchSuccessful = false;
      this.errorMsgSearch = 'Enter a username';
      return;
    }
    this.institutionService.searchUsers({username: this.keyword}).subscribe(
      response => {
        this.searchResults = response.data.users;
        this.isSearchSuccessful = true;
      },
      err => {
        this.errorMsgSearch = err.error.msg;
        this.isSearchSuccessful = false;
      }
    )
  }

  addAffiliatedUser(user): void {
    this.institutionService.addAffiliatedUser({userId: user.id}).subscribe(
      response => {
        this.tokenStorageService.saveUser(response.data.user);
        this.isAddSuccessful = true;
        this.reloadPage();
      }, err => {
        this.errorMsgAdd = err.error.msg;
        this.isAddSuccessful = false;
      }
    )
  }

  deleteAffiliatedUser(user): void {
    this.institutionService.deleteAffiliatedUser({userId: user.id}).subscribe(
      response => {
        this.tokenStorageService.saveUser(response.data.user);
        this.isDelSuccessful = true;
        this.reloadPage();
      }, err => {
        this.errorMsgDel = err.error.msg;
        this.isDelSuccessful = false;
      }
    )
  }

  reloadPage(): void {
    window.location.reload();
  }

}
