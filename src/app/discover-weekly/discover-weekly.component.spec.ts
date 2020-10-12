import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverWeeklyComponent } from './discover-weekly.component';

describe('DiscoverWeeklyComponent', () => {
  let component: DiscoverWeeklyComponent;
  let fixture: ComponentFixture<DiscoverWeeklyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverWeeklyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
