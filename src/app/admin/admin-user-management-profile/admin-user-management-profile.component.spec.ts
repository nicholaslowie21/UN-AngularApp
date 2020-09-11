import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserManagementProfileComponent } from './admin-user-management-profile.component';

describe('AdminUserManagementProfileComponent', () => {
  let component: AdminUserManagementProfileComponent;
  let fixture: ComponentFixture<AdminUserManagementProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserManagementProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserManagementProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
