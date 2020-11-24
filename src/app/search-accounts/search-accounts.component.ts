import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-search-accounts',
  templateUrl: './search-accounts.component.html',
  styleUrls: ['./search-accounts.component.css']
})
export class SearchAccountsComponent implements OnInit {

  constructor(private userService: UserService, private tokenStorageService: TokenStorageService) { }

  users: any;
  institutions: any;
  indAffiliations: any;

  async ngOnInit() {
    await this.userService.getAllUsers().toPromise().then(
      res => this.users = res.data.users
    );
    await this.userService.getAllInstitutions().toPromise().then(
      res => this.institutions = res.data.institutions
    );
    console.log(this.users);
    console.log(this.institutions);
  }

}
