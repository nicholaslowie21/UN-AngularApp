import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceMarketplaceComponent } from './resource-marketplace.component';

describe('ResourceMarketplaceComponent', () => {
  let component: ResourceMarketplaceComponent;
  let fixture: ComponentFixture<ResourceMarketplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceMarketplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
