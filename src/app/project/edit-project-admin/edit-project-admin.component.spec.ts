import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectAdminComponent } from './edit-project-admin.component';

describe('EditProjectAdminComponent', () => {
  let component: EditProjectAdminComponent;
  let fixture: ComponentFixture<EditProjectAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProjectAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
