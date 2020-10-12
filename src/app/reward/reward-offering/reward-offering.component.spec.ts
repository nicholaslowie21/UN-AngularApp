import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardOfferingComponent } from './reward-offering.component';

describe('RewardOfferingComponent', () => {
  let component: RewardOfferingComponent;
  let fixture: ComponentFixture<RewardOfferingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardOfferingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardOfferingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
