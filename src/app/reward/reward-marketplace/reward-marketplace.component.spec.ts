import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardMarketplaceComponent } from './reward-marketplace.component';

describe('RewardMarketplaceComponent', () => {
  let component: RewardMarketplaceComponent;
  let fixture: ComponentFixture<RewardMarketplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardMarketplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
