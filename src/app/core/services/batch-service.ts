import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { APIMethods } from '../constants/global.constants';
import { BatchModel } from '../models/batch.model';
import { Observable, shareReplay, tap } from 'rxjs';
import { IAPIResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class BatchService {
  http = inject(HttpClient);
  private batchesCache$?: Observable<IAPIResponse>;



  createNewBatch(batchobj: BatchModel): Observable<IAPIResponse> {
    return this.http.post<IAPIResponse>(environment.API_URL + APIMethods.BATCHES.NEW_BATCH, batchobj)
      .pipe(tap(() => (this.batchesCache$ = undefined)));
  }

  getAllBatches(): Observable<IAPIResponse> {
    if (!this.batchesCache$) {
      this.batchesCache$ = this.http
        .get<IAPIResponse>(
          environment.API_URL + APIMethods.BATCHES.NEW_BATCH
        )
        .pipe(shareReplay(1));
    }
    return this.batchesCache$;
  }


  updateBatch(batchId: number, batchObj: BatchModel): Observable<IAPIResponse> {
    //console.warn(environment.API_URL+APIMethods.UPDATE_BATCH+batchId);
    return this.http.put<IAPIResponse>(environment.API_URL + APIMethods.BATCHES.UPDATE_BATCH + batchId, batchObj)
      .pipe(tap(() => (this.batchesCache$ = undefined)));

  }

  deleteBatch(batchId: number): Observable<IAPIResponse> {
    return this.http.delete<IAPIResponse>(environment.API_URL + APIMethods.BATCHES.UPDATE_BATCH + batchId)
      .pipe(tap(() => (this.batchesCache$ = undefined)));
  }


}
