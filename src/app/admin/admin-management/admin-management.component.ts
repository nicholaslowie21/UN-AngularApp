import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {

  thisUser: any;

  admins: any;
  regionalAdmins: any;
  adminLeads: any;

  keyword = '';
  searchResults: any;
  isSearchSuccessful: any;
  errorMsgSearch = '';

  faSearch = faSearch;

  // for searching users
  filterUserCountryKey = 'Filter by country';
  // for searching admins
  filterAdminLeadsCountryKey = 'Filter by country';
  filterAdminsCountryKey = 'Filter by country';
  filterRegionalAdminsCountryKey = 'Filter by country';
  countries = ["All","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  
  constructor(private adminService: AdminService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.thisUser = this.tokenStorageService.getUser();
    this.loadAdmins();
    this.loadAdminLeads();
    this.loadRegionalAdmins();
  }

  async searchUsers() {
    if(this.keyword.length == 0) {
      this.isSearchSuccessful = false;
      this.errorMsgSearch = 'Please enter a username';
      return;
    }
    await this.adminService.searchUser({username: this.keyword}).toPromise().then(
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
  }

  async filterUsersByCountry() {
    let arr = [];
    await this.searchUsers();
    console.log(this.searchResults);
    if(this.filterUserCountryKey == 'Filter by country' || this.filterUserCountryKey == 'All') {
      return;
    } else {
      for(var i=0; i<this.searchResults.length; i++) {
        if(this.searchResults[i].country == this.filterUserCountryKey) {
          arr.push(this.searchResults[i]);
        }
      }
    }
    this.searchResults = arr;
  }

  async filterAdminLeadsByCountry() {
    let arr = [];
    await this.loadAdminLeads();
    if(this.filterAdminLeadsCountryKey == 'Filter by country' || this.filterAdminLeadsCountryKey == 'All') {
      return;
    } else {
      for(var i=0; i<this.adminLeads.length; i++) {
        if(this.adminLeads[i].country == this.filterAdminLeadsCountryKey) {
          arr.push(this.adminLeads[i]);
        }
      }
    }
    this.adminLeads = arr;
  }

  async filterAdminsByCountry() {
    let arr = [];
    await this.loadAdmins();
    if(this.filterAdminsCountryKey == 'Filter by country' || this.filterAdminsCountryKey == 'All') {
      return;
    } else {
      for(var i=0; i<this.admins.length; i++) {
        if(this.admins[i].country == this.filterAdminsCountryKey) {
          arr.push(this.admins[i]);
        }
      }
    }
    this.admins = arr;
  }

  async filterRegionalAdminsByCountry() {
    let arr = [];
    await this.loadRegionalAdmins();
    if(this.filterRegionalAdminsCountryKey == 'Filter by country' || this.filterRegionalAdminsCountryKey == 'All') {
      return;
    } else {
      for(var i=0; i<this.regionalAdmins.length; i++) {
        if(this.regionalAdmins[i].country == this.filterRegionalAdminsCountryKey) {
          arr.push(this.regionalAdmins[i]);
        }
      }
    }
    this.regionalAdmins = arr;
  }

  assignAdminLead(userId): void {
    this.adminService.assignAdminLead({id: userId}).subscribe(
      response => {
        alert("User promoted to admin lead!");
        this.loadAdmins();
        this.loadAdminLeads();
        this.loadRegionalAdmins();
        this.searchUsers();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  assignAdmin(userId): void {
    this.adminService.assignAdmin({id: userId}).subscribe(
      response => {
        alert("User promoted to admin!");
        this.loadAdmins();
        this.loadAdminLeads();
        this.loadRegionalAdmins();
        this.searchUsers();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  assignRegionalAdmin(userId): void {
    this.adminService.assignRegionalAdmin({id: userId}).subscribe(
      response => {
        alert("User promoted to regional admin!");
        this.loadAdmins();
        this.loadAdminLeads();
        this.loadRegionalAdmins();
        this.searchUsers();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  assignUser(userId): void {
    this.adminService.assignUser({id: userId}).subscribe(
      response => {
        alert("User demoted to normal user!");
        this.loadAdmins();
        this.loadAdminLeads();
        this.loadRegionalAdmins();
        this.searchUsers();
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

  async loadAdminLeads() {
    await this.adminService.getAdminLeads().toPromise().then(
      response => {
        this.adminLeads = response.data.adminLeads;
      }
    )
  }

  async loadAdmins() {
    await this.adminService.getAdmins().toPromise().then(
      response => {
        this.admins = response.data.admins;
      }
    )
  }

  async loadRegionalAdmins() {
    await this.adminService.getRegionalAdmins().toPromise().then(
      response => {
        this.regionalAdmins = response.data.regionalAdmins;
      }
    )
  }

  reloadPage(): void {
    window.location.reload();
  }

}
