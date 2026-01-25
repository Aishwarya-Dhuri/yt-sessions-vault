import { Component, inject, signal, OnInit } from '@angular/core';
import { BatchEnrollmentService } from '../../core/services/batch-enrollment-service';
import { BatchEnrollmentModel } from '../../core/models/batch-enrollment.model';
import { UserService } from '../../shared/services/user-service';

@Component({
  selector: 'app-candidate-session-recordings',
  imports: [],
  templateUrl: './candidate-session-recordings.html',
  styleUrl: './candidate-session-recordings.scss',
})
export class CandidateSessionRecordings implements OnInit {
  private enrollmentService = inject(BatchEnrollmentService);
  userService = inject(UserService);
  batchEnrollmentList = signal<BatchEnrollmentModel[]>([]);

  ngOnInit() {
    this.getBatchesByCandidateID(this.userService.loggedInUserData().candidateId);
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
