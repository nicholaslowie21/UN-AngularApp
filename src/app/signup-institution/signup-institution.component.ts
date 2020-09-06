import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup-institution',
  templateUrl: './signup-institution.component.html',
  styleUrls: ['./signup-institution.component.css']
})
export class SignupInstitutionComponent implements OnInit {

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
    this.authService.signupInstitution(this.form).subscribe(
      response => {
        console.log(response);
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
