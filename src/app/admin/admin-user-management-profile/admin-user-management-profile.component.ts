import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { JsonpClientBackend } from '@angular/common/http';

@Component({
  selector: 'app-admin-user-management-profile',
  templateUrl: './admin-user-management-profile.component.html',
  styleUrls: ['./admin-user-management-profile.component.css']
})
export class AdminUserManagementProfileComponent implements OnInit {

  username: string;
  user: any;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.username = params.username;
      },
    response => {console.log(JSON.stringify(response))}
  );
  }

}
