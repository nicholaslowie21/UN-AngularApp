import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingMarketplaceComponent } from './funding-marketplace.component';

describe('FundingMarketplaceComponent', () => {
  let component: FundingMarketplaceComponent;
  let fixture: ComponentFixture<FundingMarketplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingMarketplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
