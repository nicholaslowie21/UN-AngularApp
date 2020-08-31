import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  test(): void {
    this.authService.test().subscribe(
      response => {
        console.log(response.msg);
      },
      err => {
        console.log(err.error.msg);
      }
    )
  }

}
