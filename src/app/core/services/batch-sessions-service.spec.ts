import { TestBed } from '@angular/core/testing';

import { BatchSessionsService } from './batch-sessions-service';

describe('BatchSessionsService', () => {
  let service: BatchSessionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchSessionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
