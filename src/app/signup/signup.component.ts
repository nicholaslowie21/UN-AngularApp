import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if(this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'Your password and confirm password do not match!'
      this.isSignUpFailed = true;
      return;
    }
    this.authService.signup(this.form).subscribe(
      response => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.msg;
        this.isSignUpFailed = true;
      }
    );
  }

}
