import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ProjectService } from '../../services/project.service';
import { MappingService } from '../../services/mapping.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css'],
  providers: [MessageService]
})
export class AdminUserManagementComponent implements OnInit {

  thisUser: any;

  isAdminLead: any;
  isAdmin: any;
  isRegionalAdmin: any;
  regAdminCountry: any;

  faSearch = faSearch;
  searchType = 'Select';
  keyword = '';
  searchResults: any;
  isSearchSuccessful: any;
  errorMsgSearch = '';

  checkUser: any;

  filterCountryKey = 'Filter by country';
  countries = ["All","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  allUsers: any;
  allInst: any;
  allProj: any;
  isChanging = false;

  roleOptions = [];
  filterKeyRole = '';
  ind = 'ind';
  ins = 'ins';
  statusOptions = [];
  filterKeyStatusInd = '';
  filterKeyStatusIns = '';
  projStatusOptions = [];
  filterKeyProjStatus = '';

  // for Manage
  fileUser: any;
  fileInstitution: any;

  claims = [];
  tempStrings: any;

  userTypeOptions = [];
  filterKeyType = '';

  constructor(private adminService: AdminService, private tokenStorageService: TokenStorageService, 
    private projectService: ProjectService, private mappingService: MappingService, private messageService: MessageService) { }

  async ngOnInit() {
    this.thisUser = this.tokenStorageService.getUser();
    if(this.thisUser.role == 'regionaladmin') {
      this.isRegionalAdmin = true;
      this.regAdminCountry = this.thisUser.country;
      console.log(this.regAdminCountry);
    } else if (this.thisUser.role == 'adminlead') {
      this.isAdminLead = true;
    } else if (this.thisUser.role == 'admin') {
      this.isAdmin = true;
    }

    await this.adminService.searchUser({ username: '' }).toPromise().then(res => this.allUsers = res.data.users);
    await this.adminService.searchInstitution({ username: '' }).toPromise().then(res => this.allInst = res.data.institutions);
    await this.projectService.searchProject({ code: '' }).toPromise().then(res => this.allProj = res.data.projects);

    if(this.isRegionalAdmin) {
      let arr = [];
      for(var i=0; i<this.allUsers.length; i++) {
        if(this.allUsers[i].country == this.regAdminCountry) {
          console.log(this.allUsers[i])
          arr.push(this.allUsers[i]);
        }
      }
      this.allUsers = arr;
      console.log(this.allUsers);

      arr = [];
      for(var i=0; i<this.allInst.length; i++) {
        if(this.allInst[i].country == this.regAdminCountry) {
          arr.push(this.allInst[i]);
        }
      }
      this.allInst = arr;

      arr = [];
      for(var i=0; i<this.allProj.length; i++) {
        if(this.allProj[i].country == this.regAdminCountry) {
          arr.push(this.allProj[i]);
        }
      }
      this.allProj = arr;
    }

    this.roleOptions= [
      {label: 'all', value: 'all'},
      {label: 'adminlead', value: 'adminlead'},
      {label: 'admin', value: 'admin'},
      {label: 'regionaladmin', value: 'regionaladmin'},
      {label: 'user', value: 'user'}
    ];

    this.statusOptions= [
      {label: 'all', value: 'all'},
      {label: 'active', value: 'active'},
      {label: 'unclaimed', value: 'unclaimed'},
      {label: 'suspended', value: 'suspended'}
    ];

    this.projStatusOptions= [
      {label: 'all', value: 'all'},
      {label: 'ongoing', value: 'ongoing'},
      {label: 'completed', value: 'completed'},
      {label: 'suspended', value: 'suspended'},
      {label: 'close', value: 'close'}
    ];


    // for Manage
    await this.adminService.getClaims().toPromise().then(
      res => this.claims = res.data.claims
    );

    console.log(this.claims);

    this.userTypeOptions= [
      {label: 'All', value: 'all'},
      {label: 'Individual', value: 'individual'},
      {label: 'Institution', value: 'institution'}
    ];
  }

  async onFilterRole(event) {
    let value = event.value;
    let arr = [];
    await this.ngOnInit();
    if(value == 'all') {
      return;
    }
    else {
      for(var i=0; i<this.allUsers.length; i++) {
        if(this.allUsers[i].role == value) {
          arr.push(this.allUsers[i]);
        }
      }
      this.allUsers = arr;
    }
  }

  async onFilterStatus(event, type) {
    let value = event.value;
    let arr = [];
    await this.ngOnInit();
    if(value == 'all') {
      return;
    }
    else {
      let tempArr;
      if(type == 'ind') tempArr = this.allUsers;
      if(type == 'ins') tempArr = this.allInst;
      for(var i=0; i<tempArr.length; i++) {
        if(tempArr[i].status == value) {
          arr.push(tempArr[i]);
        }
      }
      if(type == 'ind') this.allUsers = arr;
      if(type == 'ins') this.allInst = arr;
    }
  }

  async onFilterProjStatus(event) {
    let value = event.value;
    let arr = [];
    await this.ngOnInit();
    if(value == 'all') {
      return;
    }
    else {
      for(var i=0; i<this.allProj.length; i++) {
        if(this.allProj[i].status == value) {
          arr.push(this.allProj[i]);
        }
      }
      this.allProj = arr;
    }
  }

  checkRole(a) {
    if(this.thisUser.username == a.username)  return false;
    if(a.role == 'adminlead') {
      if(this.isAdminLead)  return true;
      else  return false;
    } else {
      return true;
    }
  }

  activateUser(x: any): void {
    let r = confirm("Are you sure you want to activate this account?");
    if (r == true) {
      this.checkUser = x;
      console.log(this.checkUser);
      this.adminService.activateUser({ id: this.checkUser }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Account activated successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  suspendUser(y: any): void {
    let r = confirm("Are you sure you want to suspend this account?");
    if (r == true) {
      this.checkUser = y;
      console.log(this.checkUser);
      this.adminService.suspendUser({ id: this.checkUser }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Account suspended successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }
  
  activateProject(x: any): void {
    let r = confirm("Are you sure you want to activate this project?");
    if (r == true) {
      this.adminService.activateProject({ id: x }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Project activated successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  suspendProject(x: any): void {
    let r = confirm("Are you sure you want to suspend this project?");
    if (r == true) {
      this.adminService.suspendProject({ id: x }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Project suspended successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  activateInstitution(x: any): void {
    let r = confirm("Are you sure you want to activate this account?");
    if (r == true) {
      this.adminService.activateInstitution({ id: x }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Account activated successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  suspendInstitution(x: any): void {
    let r = confirm("Are you sure you want to suspend this account?");
    if (r == true) {
      this.adminService.suspendInstitution({ id: x }).subscribe(
        response => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Account suspended successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  // for Manage
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

  // below functions are no longer used
  async toggleType() {
    this.keyword = '';
    this.searchResults = [];
    this.isChanging = true;
    await this.adminService.getAllUsers().toPromise().then(res => this.allUsers = res.data.users);
    await this.adminService.getAllInstitutions().toPromise().then(res => this.allInst = res.data.institutions);
    await this.adminService.getAllProjects().toPromise().then(res => this.allProj = res.data.projects);
  }

  async filterByCountry() {
    let arr = [];
    await this.searchUserProject();
    if(this.filterCountryKey == 'Filter by country' || this.filterCountryKey == 'All') {
      return;
    } else {
      for(var i=0; i<this.searchResults.length; i++) {
        if(this.searchResults[i].country == this.filterCountryKey) {
          arr.push(this.searchResults[i]);
        }
      }
    }
    this.searchResults = arr;
  }

  async searchUserProject() {
    if (this.searchType == 'Select') {
      this.errorMsgSearch = 'Select search type';
      this.isSearchSuccessful = false;
      return;
    }
    if (this.keyword.length == 0) {
      this.errorMsgSearch = 'Enter a username';
      this.isSearchSuccessful = false;
      return;
    }

    this.allUsers = [];
    this.allInst = [];
    this.allProj = [];
    this.isChanging = false;

    if (this.searchType == 'individual') {
      await this.adminService.searchUser({ username: this.keyword }).toPromise().then(
        response => {
          console.log(response.data.users);
          this.searchResults = response.data.users;
          this.isSearchSuccessful = true;
        },
        err => {
          this.errorMsgSearch = err.error.msg;
          this.isSearchSuccessful = false;
        }
      )
    } else if (this.searchType == 'project') {
      await this.projectService.searchProject({ code: this.keyword }).toPromise().then(
        response => {
          this.searchResults = response.data.projects;
          this.isSearchSuccessful = true;
        },
        err => {
          this.errorMsgSearch = err.error.msg;
          this.isSearchSuccessful = false;
        }
      )
    } else {
      await this.adminService.searchInstitution({ username: this.keyword }).toPromise().then(
        response => {
          this.searchResults = response.data.institutions;
          this.isSearchSuccessful = true;
        },
        err => {
          this.errorMsgSearch = err.error.msg;
          this.isSearchSuccessful = false;
        }
      )
    }
  }

}
