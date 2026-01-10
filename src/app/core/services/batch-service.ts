import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiMethods } from '../constants/global.constants';
import { BatchModel } from '../models/batch.model';
import { Observable } from 'rxjs';
import { IAPIResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class BatchService {
  http = inject(HttpClient)

  createNewBatch(batchobj:BatchModel):Observable<IAPIResponse>{
   return this.http.post<IAPIResponse>(environment.API_URL+ApiMethods.BATCHES.NEW_BATCH,batchobj)
  }

  getAllBatches():Observable<IAPIResponse>{
    return this.http.get<IAPIResponse>(environment.API_URL+ApiMethods.BATCHES.NEW_BATCH)
  }
  

  updateBatch(batchId: number, batchObj: BatchModel):Observable<IAPIResponse>{
    //console.warn(environment.API_URL+ApiMethods.UPDATE_BATCH+batchId);
    return this.http.put<IAPIResponse>(environment.API_URL+ApiMethods.BATCHES.UPDATE_BATCH+batchId,batchObj)
    
  }

   deleteBatch(batchId: number):Observable<IAPIResponse>{
    return this.http.delete<IAPIResponse>(environment.API_URL+ApiMethods.BATCHES.UPDATE_BATCH+batchId)
  }
}
