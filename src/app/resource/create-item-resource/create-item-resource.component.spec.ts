import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemResourceComponent } from './create-item-resource.component';

describe('CreateItemResourceComponent', () => {
  let component: CreateItemResourceComponent;
  let fixture: ComponentFixture<CreateItemResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateItemResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
