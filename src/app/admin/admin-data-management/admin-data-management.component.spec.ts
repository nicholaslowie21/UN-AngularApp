import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDataManagementComponent } from './admin-data-management.component';

describe('AdminDataManagementComponent', () => {
  let component: AdminDataManagementComponent;
  let fixture: ComponentFixture<AdminDataManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDataManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDataManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
