import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProjectComponent } from './data-project.component';

describe('DataProjectComponent', () => {
  let component: DataProjectComponent;
  let fixture: ComponentFixture<DataProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
