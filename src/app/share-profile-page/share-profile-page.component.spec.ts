import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareProfilePageComponent } from './share-profile-page.component';

describe('ShareProfilePageComponent', () => {
  let component: ShareProfilePageComponent;
  let fixture: ComponentFixture<ShareProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
