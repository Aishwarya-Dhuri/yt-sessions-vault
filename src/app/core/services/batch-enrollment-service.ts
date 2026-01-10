import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiMethods } from '../constants/global.constants';
import { IAPIResponse } from '../models/common.model';
import { BatchEnrollmentModel } from '../models/batch-enrollment.model';

@Injectable({
  providedIn: 'root',
})
export class BatchEnrollmentService {
  http = inject(HttpClient);


  getAllEnrollments():Observable<IAPIResponse>{
      return this.http.get<IAPIResponse>(environment.API_URL+ApiMethods.BATCH_ENROLLMENTS.GET_ALL_ENROLLMENTS)
  }


  createNewBatchEnrollment(batchEnrollMentObj:BatchEnrollmentModel):Observable<IAPIResponse>{
     return this.http.post<IAPIResponse>(environment.API_URL+ApiMethods.BATCH_ENROLLMENTS.CREATE_BATCH_ENROLLMENTS,batchEnrollMentObj)
  }
}
