import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRewardManagementComponent } from './admin-reward-management.component';

describe('AdminRewardManagementComponent', () => {
  let component: AdminRewardManagementComponent;
  let fixture: ComponentFixture<AdminRewardManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRewardManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRewardManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
