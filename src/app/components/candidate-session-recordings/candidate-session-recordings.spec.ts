import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSessionRecordings } from './candidate-session-recordings';

describe('CandidateSessionRecordings', () => {
  let component: CandidateSessionRecordings;
  let fixture: ComponentFixture<CandidateSessionRecordings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateSessionRecordings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateSessionRecordings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
