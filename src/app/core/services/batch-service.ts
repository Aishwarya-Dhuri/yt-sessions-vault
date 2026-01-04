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
   return this.http.post<IAPIResponse>(environment.API_URL+ApiMethods.NEW_BATCH,batchobj)
  }

  getAllBatches():Observable<IAPIResponse>{
    return this.http.get<IAPIResponse>(environment.API_URL+ApiMethods.NEW_BATCH)
  }
}
