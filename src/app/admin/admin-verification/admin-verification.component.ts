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
  userid: any;
  //btn: any;


  constructor(private userService: UserService, private institutionService: InstitutionService, private tokenStorage: TokenStorageService,
    private verificationService: VerificationService, private adminService: AdminService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.user = this.tokenStorage.getUser();
      this.verificationService.getUserRequests().subscribe(response => { console.log(JSON.stringify(response)) });
      this.verificationService.getUserRequests().subscribe(response => { this.verify = response.data.verifyRequests; });
      
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

  uVerify(x: any): void {
    this.userid = x;
    console.log(JSON.stringify(this.userid));
    this.verificationService.verifyUser({ id: this.userid }).subscribe(
      response => {
        console.log(JSON.stringify(response))
      }
    );
  }

}
