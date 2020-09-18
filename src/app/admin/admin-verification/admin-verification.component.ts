import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { InstitutionService } from '../../services/institution.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { VerificationService } from '../../services/verification.service';
import { AdminService } from '../../services/admin.service';

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

  constructor(private userService: UserService, private institutionService: InstitutionService, private tokenStorage: TokenStorageService,
    private verificationService: VerificationService, private adminService: AdminService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.user = this.tokenStorage.getUser();

      //this.loadUserRequests();
      //this.loadInstitutionRequests();
      //console.log(JSON.stringify(this.verifyInstitution));

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

  loadUserRequests(): void {
    this.verificationService.getUserRequests().subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.verify = response.data.verifyRequests;
      }
    );
  }

  loadInstitutionRequests(): void {
    this.verificationService.getInstitutionRequests().subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.verifyInstitution = response.data.institutions;
      }
    );
  }

  loadRegionalUsers(): void {
    this.verificationService.getRegionalUserRequest().subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.verify = response.data.verifyRequests;
      }
    );
  }

  loadRegionalInstitutions(): void {
    this.verificationService.getRegionalInstitutionRequest().subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.verifyInstitution = response.data.institutions;
      }
    );
  }

  uVerify(x): void {
    this.verificationService.verifyUser({ id: x.requestId }).subscribe(
      response => {
        console.log(JSON.stringify(response))
        this.isAccepted = true;
        this.loadUserRequests();
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
