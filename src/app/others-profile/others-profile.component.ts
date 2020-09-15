import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-others-profile',
  templateUrl: './others-profile.component.html',
  styleUrls: ['./others-profile.component.css']
})
export class OthersProfileComponent implements OnInit {

  username: string;
  user: any;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.username = params.username;
      })
    this.userService.viewUserProfile({username: this.username}).subscribe(
      response => {
        this.user = response.data.targetUser;
      }
    )
  }

}
