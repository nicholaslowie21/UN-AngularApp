import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateRewardComponent } from './admin-create-reward.component';

describe('AdminCreateRewardComponent', () => {
  let component: AdminCreateRewardComponent;
  let fixture: ComponentFixture<AdminCreateRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreateRewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
