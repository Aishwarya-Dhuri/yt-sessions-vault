import { TestBed } from '@angular/core/testing';

import { BatchEnrollmentService } from './batch-enrollment-service';

describe('BatchEnrollmentService', () => {
  let service: BatchEnrollmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchEnrollmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
