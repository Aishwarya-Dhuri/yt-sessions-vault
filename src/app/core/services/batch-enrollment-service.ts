import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiMethods } from '../constants/global.constants';
import { IAPIResponse } from '../models/common.model';
import { BatchEnrollmentModel } from '../models/batch-enrollment.model';

@Injectable({
  providedIn: 'root',
})
export class BatchEnrollmentService {
  http = inject(HttpClient);
    private enrollmentsCache$?: Observable<IAPIResponse>;



  getAllEnrollments(): Observable<IAPIResponse> {
    if (!this.enrollmentsCache$) {
      this.enrollmentsCache$ = this.http
        .get<IAPIResponse>(
          environment.API_URL +
            ApiMethods.BATCH_ENROLLMENTS.GET_ALL_ENROLLMENTS
        )
        .pipe(shareReplay(1));
    }
    return this.enrollmentsCache$;

    
  }


  createNewBatchEnrollment(batchEnrollMentObj: BatchEnrollmentModel): Observable<IAPIResponse> {
    return this.http.post<IAPIResponse>(environment.API_URL + ApiMethods.BATCH_ENROLLMENTS.CREATE_BATCH_ENROLLMENTS, batchEnrollMentObj)
    .pipe(tap(() => (this.enrollmentsCache$ = undefined)));
  }

  updateBatchEnrollment(enrollmentId: number, batchEnrollMentObj: BatchEnrollmentModel): Observable<IAPIResponse> {
 
    return this.http.put<IAPIResponse>(environment.API_URL + ApiMethods.BATCH_ENROLLMENTS.CREATE_BATCH_ENROLLMENTS + enrollmentId, batchEnrollMentObj)
    .pipe(tap(() => (this.enrollmentsCache$ = undefined)));

  }

  deleteBatchEnrollment(enrollmentId: number): Observable<IAPIResponse> {
    return this.http.delete<IAPIResponse>(environment.API_URL + ApiMethods.BATCH_ENROLLMENTS.CREATE_BATCH_ENROLLMENTS + enrollmentId)
     .pipe(tap(() => (this.enrollmentsCache$ = undefined)));
  }
}
