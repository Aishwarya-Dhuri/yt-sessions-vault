import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchEnrollments } from './batch-enrollments';

describe('BatchEnrollments', () => {
  let component: BatchEnrollments;
  let fixture: ComponentFixture<BatchEnrollments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchEnrollments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchEnrollments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
