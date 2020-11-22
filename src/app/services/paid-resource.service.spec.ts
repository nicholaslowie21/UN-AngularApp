import { TestBed } from '@angular/core/testing';

import { PaidResourceService } from './paid-resource.service';

describe('PaidResourceService', () => {
  let service: PaidResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaidResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
