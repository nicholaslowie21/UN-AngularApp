import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliationPageComponent } from './affiliation-page.component';

describe('AffiliationPageComponent', () => {
  let component: AffiliationPageComponent;
  let fixture: ComponentFixture<AffiliationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
