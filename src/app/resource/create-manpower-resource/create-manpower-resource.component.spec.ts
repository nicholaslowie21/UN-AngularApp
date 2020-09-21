import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManpowerResourceComponent } from './create-manpower-resource.component';

describe('CreateManpowerResourceComponent', () => {
  let component: CreateManpowerResourceComponent;
  let fixture: ComponentFixture<CreateManpowerResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateManpowerResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateManpowerResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
