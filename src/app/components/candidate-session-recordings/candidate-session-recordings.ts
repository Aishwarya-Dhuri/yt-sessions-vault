import { Component, inject, signal } from '@angular/core';
import { CandidateModel } from '../../core/models/candiate.model';
import { GlobalConstants } from '../../core/constants/global.constants';
import { BatchEnrollmentService } from '../../core/services/batch-enrollment-service';
import { BatchEnrollmentModel } from '../../core/models/batch-enrollment.model';

@Component({
  selector: 'app-candidate-session-recordings',
  imports: [],
  templateUrl: './candidate-session-recordings.html',
  styleUrl: './candidate-session-recordings.scss',
})
export class CandidateSessionRecordings {
  loggedInUserData = signal<CandidateModel | null>(null);
  private enrollmentService = inject(BatchEnrollmentService);

  batchEnrollmentList = signal<BatchEnrollmentModel[]>([]);

  constructor() {
    this.loadUserData();
  }

  ngOnInit() {
   this.getBatchesByCandidateID(this.loggedInUserData()?.candidateId || 0);
  }

  private loadUserData() {
    const localData = localStorage.getItem(GlobalConstants.LOGIN_LOCAL_KEY);
    console.log(localData)
    if (localData != null) {
      try {
        this.loggedInUserData.set(JSON.parse(localData));
        console.log(JSON.parse(localData).role);
        
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        this.loggedInUserData.set(null);
      }
    }
  }


  getBatchesByCandidateID(candidateId: number) {
    this.enrollmentService.getEnrolledBatchesByCandidateId(candidateId).subscribe({
      next: (res) => {
        console.log('Enrolled batches:', res.data);
        this.batchEnrollmentList.set(res.data);

      },
      error: (err) => {
        console.error('Error fetching enrolled batches:', err);
      }
    });
  }
}
