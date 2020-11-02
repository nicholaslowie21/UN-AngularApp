import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSubmittedComponent } from './report-submitted.component';

describe('ReportSubmittedComponent', () => {
  let component: ReportSubmittedComponent;
  let fixture: ComponentFixture<ReportSubmittedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSubmittedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
