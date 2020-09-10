import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './signup/signup.component';
import { SignupInstitutionComponent } from './signup-institution/signup-institution.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AboutComponent } from './about/about.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/forgotPassword', component: ForgotPasswordComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/institution', component: SignupInstitutionComponent },
  { path: 'editProfile', component: EditProfileComponent, canActivate: [AuthGuardService] },
  { path: 'admin', component: AdminHomeComponent, canActivate: [AuthGuardService] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
