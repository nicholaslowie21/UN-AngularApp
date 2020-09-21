import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateContributorComponent } from './rate-contributor.component';

describe('RateContributorComponent', () => {
  let component: RateContributorComponent;
  let fixture: ComponentFixture<RateContributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateContributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateContributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
