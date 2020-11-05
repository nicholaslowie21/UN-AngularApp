import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ProjectService } from '../../services/project.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
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

  constructor(private adminService: AdminService, private tokenStorageService: TokenStorageService, 
    private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
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

  viewUser(user): void {
    let userType = '';
    if(user.role) {
      userType = 'individual';
    } else {
      userType = 'institution';
    }
    this.router.navigate(['/admin/user-management/profile'], {queryParams: {username: user.username, userType: userType}});
    this.searchType = 'Select';
    this.keyword = '';
  }

  viewProject(project): void {
    this.router.navigate(['/admin/user-management/profile'], {queryParams: {id: project.id}});
    this.searchType = 'Select';
    this.keyword = '';
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

  activateUser(x: any): void {
    this.checkUser = x;
    console.log(this.checkUser);
    this.adminService.activateUser({ id: this.checkUser }).subscribe(
      response => {
        alert("User has been activated!");
        this.searchUserProject();
        // console.log(JSON.stringify(response));
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  suspendUser(y: any): void {
    this.checkUser = y;
    console.log(this.checkUser);
    this.adminService.suspendUser({ id: this.checkUser }).subscribe(
      response => {
        alert("User has been suspended!");
        this.searchUserProject();
        // console.log(JSON.stringify(response));
      },
      err => {
        alert(err.error.msg);
      }
    )
  }
  
  activateProject(x: any): void {
    this.adminService.activateProject({ id: x }).subscribe(
      response => {
        alert("Project has been activated!");
        this.searchUserProject();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  suspendProject(x: any): void {
    this.adminService.suspendProject({ id: x }).subscribe(
      response => {
        alert("Project has been suspended!");
        this.searchUserProject();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  activateInstitution(x: any): void {
    this.adminService.activateInstitution({ id: x }).subscribe(
      response => {
        alert("Institution has been activated!");
        this.searchUserProject();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  suspendInstitution(x: any): void {
    this.adminService.suspendInstitution({ id: x }).subscribe(
      response => {
        alert("Institution has been suspended!");
        this.searchUserProject();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

}
