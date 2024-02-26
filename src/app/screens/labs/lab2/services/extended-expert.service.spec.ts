import { TestBed } from '@angular/core/testing';

import { ExtendedExpertService } from './extended-expert.service';

describe('ExtendedExpertService', () => {
  let service: ExtendedExpertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtendedExpertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
