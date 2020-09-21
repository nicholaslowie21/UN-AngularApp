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
import { OthersProfileComponent } from './others-profile/others-profile.component';

import { ShareModule } from 'ngx-sharebuttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SafePipe } from './safe.pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { ShareProfilePageComponent } from './share-profile-page/share-profile-page.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { MyProjectsComponent } from './project/my-projects/my-projects.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { EditProjectDetailsComponent } from './project/edit-project-details/edit-project-details.component';
import { EditProjectAdminComponent } from './project/edit-project-admin/edit-project-admin.component';
import { RateContributorComponent } from './project/rate-contributor/rate-contributor.component';
import { MyResourcesComponent } from './resource/my-resources/my-resources.component';
import { ResourceDetailsComponent } from './resource/resource-details/resource-details.component';
import { CreateItemResourceComponent } from './resource/create-item-resource/create-item-resource.component';
import { CreateKnowledgeResourceComponent } from './resource/create-knowledge-resource/create-knowledge-resource.component';
import { CreateVenueResourceComponent } from './resource/create-venue-resource/create-venue-resource.component';
import { CreateManpowerResourceComponent } from './resource/create-manpower-resource/create-manpower-resource.component';
import { EditResourceDetailsComponent } from './resource/edit-resource-details/edit-resource-details.component';

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
    AdminUserManagementProfileComponent,
    OthersProfileComponent,
    SafePipe,
    ShareProfilePageComponent,
    ProjectDetailsComponent,
    MyProjectsComponent,
    CreateProjectComponent,
    EditProjectDetailsComponent,
    EditProjectAdminComponent,
    RateContributorComponent,
    MyResourcesComponent,
    ResourceDetailsComponent,
    CreateItemResourceComponent,
    CreateKnowledgeResourceComponent,
    CreateVenueResourceComponent,
    CreateManpowerResourceComponent,
    EditResourceDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ShareModule,
    ShareIconsModule,
    FontAwesomeModule,
    ClipboardModule
  ],
  providers: [authInterceptorProviders, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }