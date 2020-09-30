import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: any;
  userType: any;

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    if(this.tokenStorageService.getAccountType() == 'user') {
      this.userType = 'individual';
    } else {
      this.userType = 'institution';
    }
  }

}
