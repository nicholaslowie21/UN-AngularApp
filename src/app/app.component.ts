import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private role: string;
  isLoggedIn = false;
  username: string;
  showAdmin = false;

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      console.log(this.role);
      if(this.role == 'admin') {
        this.showAdmin = true;
      } else if(this.role == 'regionaladmin') {
        this.showAdmin = true;
      } else if(this.role == 'adminlead') {
        this.showAdmin = true;
      }

      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.logOut();
    window.location.reload();
  }
}
