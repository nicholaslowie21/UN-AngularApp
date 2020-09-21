import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResourceDetailsComponent } from './edit-resource-details.component';

describe('EditResourceDetailsComponent', () => {
  let component: EditResourceDetailsComponent;
  let fixture: ComponentFixture<EditResourceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditResourceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditResourceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
