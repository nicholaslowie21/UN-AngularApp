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
import { AdminReportDetailsComponent } from './admin/admin-report-details/admin-report-details.component';
import { AdminUserManagementComponent } from './admin/admin-user-management/admin-user-management.component';
import { AdminUserManagementProfileComponent } from './admin/admin-user-management-profile/admin-user-management-profile.component';
import { AdminVerificationComponent } from './admin/admin-verification/admin-verification.component';
import { AdminRewardManagementComponent } from './admin/admin-reward-management/admin-reward-management.component';
import { AdminCreateRewardComponent } from './admin/admin-create-reward/admin-create-reward.component';
import { AdminAnnouncementComponent } from './admin/admin-announcement/admin-announcement.component';
import { AdminDataManagementComponent } from './admin/admin-data-management/admin-data-management.component';
import { ShareProfilePageComponent } from './share-profile-page/share-profile-page.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { EditProjectAdminComponent } from './project/edit-project-admin/edit-project-admin.component';
import { EditProjectDetailsComponent } from './project/edit-project-details/edit-project-details.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { MyProjectsComponent } from './project/my-projects/my-projects.component';
import { ProjectResourcesComponent } from './project/project-resources/project-resources.component';
import { RateContributorComponent } from './project/rate-contributor/rate-contributor.component';
import { CreateResourceComponent } from './resource/create-resource/create-resource.component';
import { EditResourceDetailsComponent } from './resource/edit-resource-details/edit-resource-details.component';
import { MyResourcesComponent } from './resource/my-resources/my-resources.component';
import { ResourceDetailsComponent } from './resource/resource-details/resource-details.component';
import { ProjectMarketplaceComponent } from './marketplace/project-marketplace/project-marketplace.component';
import { ResourceMarketplaceComponent } from './marketplace/resource-marketplace/resource-marketplace.component';
import { FundingMarketplaceComponent } from './marketplace/funding-marketplace/funding-marketplace.component';
import { ProjectRequestsComponent } from './project/project-requests/project-requests.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { DiscoverWeeklyComponent } from './discover-weekly/discover-weekly.component';
import { RewardOfferingComponent } from './reward/reward-offering/reward-offering.component';
import { CreateRewardComponent } from './reward/create-reward/create-reward.component';
import { RewardMarketplaceComponent } from './reward/reward-marketplace/reward-marketplace.component';
import { MyRewardsComponent } from './reward/my-rewards/my-rewards.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { ReportSubmittedComponent } from './report-submitted/report-submitted.component';
import { ChatComponent } from './chat/chat.component';
import { DataDashboardComponent } from './data-overview/data-dashboard/data-dashboard.component';
import { SearchAccountsComponent } from './search-accounts/search-accounts.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { DataProjectComponent } from './data-overview/data-project/data-project.component';
import { PaidResourceDetailsComponent } from './resource/paid-resource-details/paid-resource-details.component';
import { DonateComponent } from './donate/donate.component';
import { MyPurchasesComponent } from './my-purchases/my-purchases.component';
import { EditTargetComponent } from './edit-target/edit-target.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/forgotPassword', component: ForgotPasswordComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/institution', component: SignupInstitutionComponent },
  { path: 'editProfile', component: EditProfileComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: OwnProfileComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
  { path: 'institution/affiliation', component: AffiliationPageComponent, canActivate: [AuthGuardService] },
  { path: 'admin', canActivate: [AuthGuardService], canActivateChild: [AuthGuardService],
    children: [
      { path: 'admin-management', component: AdminManagementComponent },
      { path: 'report', component: AdminReportComponent },
      { path: 'reportDetails', component: AdminReportDetailsComponent },
      { path: 'user-management', component: AdminUserManagementComponent },
      { path: 'user-management/profile', component: AdminUserManagementProfileComponent },
      { path: 'verification', component: AdminVerificationComponent },
      { path: 'reward', component: AdminRewardManagementComponent },
      { path: 'create-reward', component: AdminCreateRewardComponent},
      { path: 'announcement', component: AdminAnnouncementComponent},
      { path: 'data-management', component: AdminDataManagementComponent},
      { path: '', component: AdminHomeComponent, pathMatch: 'full'}
    ] 
  },
  { path: 'project', canActivate: [AuthGuardService],
    children: [
      { path: 'create', component: CreateProjectComponent },
      { path: 'editAdmin', component: EditProjectAdminComponent},
      { path: 'editDetails', component: EditProjectDetailsComponent},
      { path: 'projectDetails', component: ProjectDetailsComponent},
      { path: 'myProjects', component: MyProjectsComponent},
      { path: 'resources', component: ProjectResourcesComponent},
      { path: 'rateContributor', component: RateContributorComponent},
      { path: 'requests', component: ProjectRequestsComponent}
    ]
  },
  { path: 'resource', canActivate: [AuthGuardService],
    children: [
      { path: 'createResource', component: CreateResourceComponent },
      { path: 'editDetails', component: EditResourceDetailsComponent},
      { path: 'myResources', component: MyResourcesComponent},
      { path: 'resourceDetails', component: ResourceDetailsComponent},
      { path: 'paid/details', component: PaidResourceDetailsComponent}
    ]
  },
  { path: 'marketplace', canActivate: [AuthGuardService],
    children: [
      { path: 'project', component: ProjectMarketplaceComponent },
      { path: 'resource', component: ResourceMarketplaceComponent},
      { path: 'funding', component: FundingMarketplaceComponent}
    ]
  },
  { path: 'reward', canActivate: [AuthGuardService],
    children: [
      { path: 'offering', component: RewardOfferingComponent },
      { path: 'create', component: CreateRewardComponent },
      { path: 'myRewards', component: MyRewardsComponent },
      { path: '', component: RewardMarketplaceComponent, pathMatch: 'full'}
    ]
  },
  { path: 'dashboard', 
    children: [
      {path: '', component: DataDashboardComponent},
      {path: 'project', component: DataProjectComponent}
    ]
  },
  { path: 'shareProfile', component: ShareProfilePageComponent, canActivate: [AuthGuardService] },
  { path: 'myRequests', component: MyRequestsComponent, canActivate: [AuthGuardService] },
  { path: 'discover-weekly', component: DiscoverWeeklyComponent, canActivate: [AuthGuardService] },
  { path: 'announcements', component: AnnouncementComponent, canActivate: [AuthGuardService] },
  { path: 'reports-submitted', component: ReportSubmittedComponent, canActivate: [AuthGuardService] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuardService] },
  { path: 'search', component: SearchAccountsComponent},
  { path: 'testimonial', component: TestimonialComponent, canActivate: [AuthGuardService] },
  { path: 'donate', component: DonateComponent},
  { path: 'myPurchases', component: MyPurchasesComponent, canActivate: [AuthGuardService] },
  { path: 'edit-target', component: EditTargetComponent,  canActivate: [AuthGuardService]},
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
