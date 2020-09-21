import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKnowledgeResourceComponent } from './create-knowledge-resource.component';

describe('CreateKnowledgeResourceComponent', () => {
  let component: CreateKnowledgeResourceComponent;
  let fixture: ComponentFixture<CreateKnowledgeResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateKnowledgeResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateKnowledgeResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
