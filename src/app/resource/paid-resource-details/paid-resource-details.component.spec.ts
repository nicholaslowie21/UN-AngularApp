import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidResourceDetailsComponent } from './paid-resource-details.component';

describe('PaidResourceDetailsComponent', () => {
  let component: PaidResourceDetailsComponent;
  let fixture: ComponentFixture<PaidResourceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidResourceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidResourceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
