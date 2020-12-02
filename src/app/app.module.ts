import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

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
import { CreateResourceComponent } from './resource/create-resource/create-resource.component';
import { EditResourceDetailsComponent } from './resource/edit-resource-details/edit-resource-details.component';
import { ProjectResourcesComponent } from './project/project-resources/project-resources.component';

import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import {CarouselModule} from 'primeng/carousel';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ProgressBarModule} from 'primeng/progressbar';
import {GalleriaModule} from 'primeng/galleria';
import {MultiSelectModule} from 'primeng/multiselect';
import {CalendarModule} from 'primeng/calendar';
import {FullCalendarModule} from 'primeng/fullcalendar';
import {ChartModule} from 'primeng/chart';
import {TableModule} from 'primeng/table';

import { ProjectMarketplaceComponent } from './marketplace/project-marketplace/project-marketplace.component';
import { ResourceMarketplaceComponent } from './marketplace/resource-marketplace/resource-marketplace.component';
import { FundingMarketplaceComponent } from './marketplace/funding-marketplace/funding-marketplace.component';
import { ProjectRequestsComponent } from './project/project-requests/project-requests.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { DiscoverWeeklyComponent } from './discover-weekly/discover-weekly.component';
import { RewardOfferingComponent } from './reward/reward-offering/reward-offering.component';
import { CreateRewardComponent } from './reward/create-reward/create-reward.component';
import { RewardMarketplaceComponent } from './reward/reward-marketplace/reward-marketplace.component';
import { AdminRewardManagementComponent } from './admin/admin-reward-management/admin-reward-management.component';
import { AdminCreateRewardComponent } from './admin/admin-create-reward/admin-create-reward.component';
import { MyRewardsComponent } from './reward/my-rewards/my-rewards.component';
import { AdminAnnouncementComponent } from './admin/admin-announcement/admin-announcement.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { ReportSubmittedComponent } from './report-submitted/report-submitted.component';
import { AdminReportDetailsComponent } from './admin/admin-report-details/admin-report-details.component';
import { ChatComponent } from './chat/chat.component';
import { DataDashboardComponent } from './data-overview/data-dashboard/data-dashboard.component';
import { SearchAccountsComponent } from './search-accounts/search-accounts.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { DataProjectComponent } from './data-overview/data-project/data-project.component';
import { PaidResourceDetailsComponent } from './resource/paid-resource-details/paid-resource-details.component';
import { DonateComponent } from './donate/donate.component';
import { MyPurchasesComponent } from './my-purchases/my-purchases.component';
import { EditTargetComponent } from './edit-target/edit-target.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    EditProfileComponent,
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
    CreateResourceComponent,
    EditResourceDetailsComponent,
    ProjectResourcesComponent,
    ProjectMarketplaceComponent,
    ResourceMarketplaceComponent,
    FundingMarketplaceComponent,
    ProjectRequestsComponent,
    MyRequestsComponent,
    DiscoverWeeklyComponent,
    RewardOfferingComponent,
    CreateRewardComponent,
    RewardMarketplaceComponent,
    AdminRewardManagementComponent,
    AdminCreateRewardComponent,
    MyRewardsComponent,
    AdminAnnouncementComponent,
    AnnouncementComponent,
    ReportSubmittedComponent,
    AdminReportDetailsComponent,
    ChatComponent,
    DataDashboardComponent,
    SearchAccountsComponent,
    TestimonialComponent,
    DataProjectComponent,
    PaidResourceDetailsComponent,
    DonateComponent,
    MyPurchasesComponent,
    EditTargetComponent,
    TermsConditionsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ShareModule,
    ShareIconsModule,
    FontAwesomeModule,
    ClipboardModule,
    DataViewModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    RatingModule,
    ToastModule,
    CarouselModule,
    InputSwitchModule,
    ProgressBarModule,
    GalleriaModule,
    MultiSelectModule,
    CalendarModule,
    FullCalendarModule,
    ChartModule,
    TableModule
  ],
  providers: [authInterceptorProviders, AuthGuardService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }