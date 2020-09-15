import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './signup/signup.component';
import { SignupInstitutionComponent } from './signup-institution/signup-institution.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AboutComponent } from './about/about.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SettingsComponent } from './settings/settings.component';
import { OwnProfileComponent } from './own-profile/own-profile.component';
import { AffiliationPageComponent } from './affiliation-page/affiliation-page.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminManagementComponent } from './admin/admin-management/admin-management.component';
import { AdminReportComponent } from './admin/admin-report/admin-report.component';
import { AdminUserManagementComponent } from './admin/admin-user-management/admin-user-management.component';
import { AdminUserManagementProfileComponent } from './admin/admin-user-management-profile/admin-user-management-profile.component';
import { AdminVerificationComponent } from './admin/admin-verification/admin-verification.component';
import { OthersProfileComponent } from './others-profile/others-profile.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/forgotPassword', component: ForgotPasswordComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/institution', component: SignupInstitutionComponent },
  { path: 'editProfile', component: EditProfileComponent, canActivate: [AuthGuardService] },
  { path: 'ownProfile', component: OwnProfileComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: OthersProfileComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
  { path: 'institution/affiliation', component: AffiliationPageComponent, canActivate: [AuthGuardService] },
  { path: 'admin', canActivate: [AuthGuardService], canActivateChild: [AuthGuardService],
    children: [
      { path: 'admin-management', component: AdminManagementComponent },
      { path: 'report', component: AdminReportComponent },
      { path: 'user-management', component: AdminUserManagementComponent },
      { path: 'user-management/profile', component: AdminUserManagementProfileComponent },
      { path: 'verification', component: AdminVerificationComponent },
      { path: '', component: AdminHomeComponent, pathMatch: 'full'}
    ] 
  },
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
