import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuardService } from '../app/services/auth-guard.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { LandingComponent } from './landing/landing.component';
import { SignupInstitutionComponent } from './signup-institution/signup-institution.component';
import { AboutComponent } from './about/about.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SettingsComponent } from './settings/settings.component';
import { OwnProfileComponent } from './own-profile/own-profile.component';
import { AffiliationPageComponent } from './affiliation-page/affiliation-page.component';
import { AdminVerificationComponent } from './admin/admin-verification/admin-verification.component';
import { AdminUserManagementComponent } from './admin/admin-user-management/admin-user-management.component';
import { AdminManagementComponent } from './admin/admin-management/admin-management.component';
import { AdminReportComponent } from './admin/admin-report/admin-report.component';
import { AdminUserManagementProfileComponent } from './admin/admin-user-management-profile/admin-user-management-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    EditProfileComponent,
    AdminHomeComponent,
    LandingComponent,
    SignupInstitutionComponent,
    AboutComponent,
    ForgotPasswordComponent,
    SettingsComponent,
    OwnProfileComponent,
    AffiliationPageComponent,
    AdminVerificationComponent,
    AdminUserManagementComponent,
    AdminManagementComponent,
    AdminReportComponent,
    AdminUserManagementProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }