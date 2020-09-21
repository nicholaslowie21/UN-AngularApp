import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVenueResourceComponent } from './create-venue-resource.component';

describe('CreateVenueResourceComponent', () => {
  let component: CreateVenueResourceComponent;
  let fixture: ComponentFixture<CreateVenueResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVenueResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVenueResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
