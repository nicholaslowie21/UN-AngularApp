import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVerificationComponent } from './admin-verification.component';

describe('AdminVerificationComponent', () => {
  let component: AdminVerificationComponent;
  let fixture: ComponentFixture<AdminVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
