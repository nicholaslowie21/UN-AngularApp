import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form: any = {};
  isSubmitted = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  forgotPassword(): void {
    this.authService.forgetPassword(this.form).subscribe(
      response => {
        this.isSubmitted = true;
      },
      err => {
        this.isSubmitted = false;
        this.errorMessage = err.error.msg;
      }
    )
  }

}
