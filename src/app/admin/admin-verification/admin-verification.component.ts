import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { InstitutionService } from '../../services/institution.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { VerificationService } from '../../services/verification.service';
import { AdminService } from '../../services/admin.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-admin-verification',
  templateUrl: './admin-verification.component.html',
  styleUrls: ['./admin-verification.component.css']
})
export class AdminVerificationComponent implements OnInit {

  user: any;
  isLoggedIn = false;

  isLead = false;
  isRegional = false;
  isAdmin = false;

  verify: any;
  verifyInstitution: any;
  reqId: any;
  rejId: any;
  //btn: any;

  errorMsg = '';
  isAccepted = false;
  isRejected = false;

  tempStrings: any;

  filterUserCountryKey = 'Filter by country';
  filterInstitutionCountryKey = 'Filter by country';
  countries = ["All","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

  constructor(private userService: UserService, private institutionService: InstitutionService, private tokenStorage: TokenStorageService,
    private verificationService: VerificationService, private adminService: AdminService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.user = this.tokenStorage.getUser();

      this.filterUserCountryKey = 'Filter by country';

      if (this.tokenStorage.getUser().role == "admin") {
        this.isAdmin = true;
        this.loadUserRequests();
        this.loadInstitutionRequests();
      } else if (this.tokenStorage.getUser().role == "regionaladmin") {
        this.isRegional = true;
        this.loadRegionalUsers();
        this.loadRegionalInstitutions();
        //only can view regional users, institutions and projects
      } else if (this.tokenStorage.getUser().role == "adminlead") {
        this.isLead = true;
        this.loadUserRequests();
        this.loadInstitutionRequests();
      }
    }
  }

  async filterUsersByCountry() {
    let arr = [];
    if (this.tokenStorage.getUser().role == "regionaladmin") {
      await this.loadRegionalUsers();
    } else {
      await this.loadUserRequests();
    }
    if (this.filterUserCountryKey == 'Filter by country' || this.filterUserCountryKey == 'All') {
      return;
    } else {
      for(var i=0; i<this.verify.length; i++) {
        if(this.verify[i].country == this.filterUserCountryKey) {
          arr.push(this.verify[i]);
        }
      }
    }
    this.verify = arr;
  }

  async filterInstitutionsByCountry() {
    let arr = [];
    if (this.tokenStorage.getUser().role == "regionaladmin") {
      await this.loadRegionalInstitutions();
    } else {
      await this.loadInstitutionRequests();
    }
    if (this.filterInstitutionCountryKey == 'Filter by country' || this.filterInstitutionCountryKey == 'All') {
      return;
    } else {
      for(var i=0; i<this.verifyInstitution.length; i++) {
        if(this.verifyInstitution[i].country == this.filterInstitutionCountryKey) {
          arr.push(this.verifyInstitution[i]);
        }
      }
    }
    this.verifyInstitution = arr;
  }

  async loadUserRequests() {
    await this.verificationService.getUserRequests().toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.verify = response.data.verifyRequests;
      }
    );
  }

  async loadInstitutionRequests() {
    await this.verificationService.getInstitutionRequests().toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.verifyInstitution = response.data.institutions;
      }
    );
  }

  async loadRegionalUsers() {
    await this.verificationService.getRegionalUserRequest().toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.verify = response.data.verifyRequests;
      }
    );
  }

  async loadRegionalInstitutions() {
    await this.verificationService.getRegionalInstitutionRequest().toPromise().then(
      response => {
        console.log(JSON.stringify(response));
        this.verifyInstitution = response.data.institutions;
      }
    );
  }

  downloadAttachment(filePath) {
    console.log(filePath);
    this.verificationService.getAttachmentFile(filePath).subscribe(
      response => {
        this.tempStrings = filePath.split("/");
        console.log(this.tempStrings);
        saveAs(response, this.tempStrings[this.tempStrings.length-1]);
        // this.reloadPage();
      },
      err => {
        alert('Something went wrong while downloading the file. Please try again!')
      }
    )
  }

  uVerify(x): void {
    this.verificationService.verifyUser({ id: x.requestId }).subscribe(
      response => {
        console.log(JSON.stringify(response))
        this.isAccepted = true;
        this.loadUserRequests();
        this.filterUsersByCountry();
        alert("User "+ x.username +" verification is accepted");
        // this.reloadPage();
      },
      err => {
        this.errorMsg = err.error.msg;
        this.isAccepted = false;
      }
    );
  }

  uReject(x): void {
    this.verificationService.rejectUser({ id: x.requestId }).subscribe(
      response => {
        console.log(JSON.stringify(response))
        this.isRejected = true;
        this.loadUserRequests();
        this.filterUsersByCountry();
        alert("User "+ x.username +" verification is rejected")
        // this.reloadPage();
      },
      err => {
        this.errorMsg = err.error.msg;
        this.isRejected = false;
      }
    );
  }

  iVerify(x): void {
    this.verificationService.verifyInstitution({ id: x.id }).subscribe(
      response => {
        console.log(JSON.stringify(response))
        this.isAccepted = true;
        this.loadInstitutionRequests();
        this.filterInstitutionsByCountry();
        alert("Institution "+ x.username +" verification is accepted");
        // this.reloadPage();
      },
      err => {
        this.errorMsg = err.error.msg;
        this.isAccepted = false;
      }
    );
  }

  iReject(x): void {
    this.verificationService.rejectInstitution({ id: x.id }).subscribe(
      response => {
        console.log(JSON.stringify(response))
        this.isRejected = true;
        this.loadInstitutionRequests();
        this.filterInstitutionsByCountry();
        alert("Institution " + x.username +  " verification is rejected");
        // this.reloadPage();
      },
      err => {
        this.errorMsg = err.error.msg;
        this.isRejected = false;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
