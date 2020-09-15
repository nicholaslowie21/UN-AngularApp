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

      this.loadUserRequests();
      this.loadInstitutionRequests();
      //console.log(JSON.stringify(this.verifyInstitution));

      if (this.tokenStorage.getUser().role == "admin") {
        this.isAdmin = true;
      } else if (this.tokenStorage.getUser().role == "regionaladmin") {
        this.isRegional = true;
        //only can view regional users, institutions and projects
      } else if (this.tokenStorage.getUser().role == "adminlead") {
        this.isLead = true;
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

  uVerify(x: any): void {
    this.reqId = x;
    console.log(JSON.stringify(this.reqId));
    this.verificationService.verifyUser({ id: this.reqId }).subscribe(
      response => {
        console.log(JSON.stringify(response))
        this.isAccepted = true;
        this.loadUserRequests();
      },
      err => {
        this.errorMsg = err.error.msg;
        this.isAccepted = false;
      }
    );
  }

  uReject(x: any): void {
    this.rejId = x;
    console.log(JSON.stringify(this.rejId));
    this.verificationService.rejectUser({ id: this.rejId }).subscribe(
      response => {
        console.log(JSON.stringify(response))
        this.isRejected = true;
        this.loadUserRequests();
      },
      err => {
        this.errorMsg = err.error.msg;
        this.isRejected = false;
      }
    );
  }

  iVerify(x: any): void {
    this.reqId = x;
    console.log(JSON.stringify(this.reqId));
    this.verificationService.verifyInstitution({ id: this.reqId }).subscribe(
      response => {
        console.log(JSON.stringify(response))
        this.isAccepted = true;
        this.loadInstitutionRequests();
      },
      err => {
        this.errorMsg = err.error.msg;
        this.isAccepted = false;
      }
    );
  }

  iReject(x: any): void {
    this.rejId = x;
    console.log(JSON.stringify(this.rejId));
    this.verificationService.rejectInstitution({ id: this.rejId }).subscribe(
      response => {
        console.log(JSON.stringify(response))
        this.isRejected = true;
        this.loadInstitutionRequests();
      },
      err => {
        this.errorMsg = err.error.msg;
        this.isRejected = false;
      }
    );
  }
}
