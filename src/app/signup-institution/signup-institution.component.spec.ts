import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupInstitutionComponent } from './signup-institution.component';

describe('SignupInstitutionComponent', () => {
  let component: SignupInstitutionComponent;
  let fixture: ComponentFixture<SignupInstitutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupInstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
