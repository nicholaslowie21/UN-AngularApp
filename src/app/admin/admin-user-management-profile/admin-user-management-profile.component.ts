import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { JsonpClientBackend } from '@angular/common/http';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-user-management-profile',
  templateUrl: './admin-user-management-profile.component.html',
  styleUrls: ['./admin-user-management-profile.component.css']
})
export class AdminUserManagementProfileComponent implements OnInit {

  username: string;
  user: any;
  userList: any;
  errMsg: "";

  checkUser: any;
  userId: any;

  constructor(private route: ActivatedRoute, private userService: UserService, private adminService: AdminService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.username = params.username;
        //this.userId = params.id;
      },
        response => { console.log(JSON.stringify(response)) }
      );
    console.log(this.username);
    //console.log(this.userId);
    this.userService.viewUserProfile({ username: this.username }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.user = response.data.targetUser;
        //console.log(this.user.name);
      },
      err => {
        alert(err.error.message);
      }
    );

    this.adminService.searchUser({ username: this.username }).subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.userList = response.data.users;
        console.log(JSON.stringify(this.userList.length));
      },
      err => {
        alert(err.error.message);
      }
    );

    /**var length = JSON.stringify(this.userList);
    var length1: number = +length;

    for(var i=0; i< length1; i++) {
      console.log("hello");
    }

    for(var i=0; i<this.userList.length; i++) {
      if(username.charAt(i)==' ') {
        usernameFormatted = usernameFormatted.concat('%20');
      } else {
        usernameFormatted = usernameFormatted.concat(username.charAt(i));
      }
    } **/
  }

  activateUser(x: any): void {
    this.checkUser = x;
    console.log(this.checkUser);
    this.adminService.activateUser({ id: this.checkUser }).subscribe(
      response => {
        alert("User has been activated!");
        //this.searchUsers();
      }
    )
  }

  suspendUser(y: any): void {
    this.checkUser = y;
    console.log(this.checkUser);
    this.adminService.suspendUser({ id: this.checkUser }).subscribe(
      response => {
        alert("User has been suspended!");
        //this.searchUsers();
        // console.log(JSON.stringify(response));
      }
    )
  }

}
