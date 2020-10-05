import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMarketplaceComponent } from './project-marketplace.component';

describe('ProjectMarketplaceComponent', () => {
  let component: ProjectMarketplaceComponent;
  let fixture: ComponentFixture<ProjectMarketplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMarketplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
