import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIMethods } from '../constants/global.constants';
import { IAPIResponse } from '../models/common.model';
import { BatchSessionModel } from '../models/batch-session.model';

@Injectable({
  providedIn: 'root',
})
export class BatchSessionsService {
  http = inject(HttpClient);
  private sessionsCache$?: Observable<IAPIResponse>;


  getAllSessionsRecordings(): Observable<IAPIResponse> {
    if (!this.sessionsCache$) {
      this.sessionsCache$ = this.http.get<IAPIResponse>(environment.API_URL +
        APIMethods.BATCH_SESSIONS.GET_ALL_SESSION_RECORDINGDS
      )
        .pipe(shareReplay(1));
    }
    return this.sessionsCache$;


  }

  createNewSessionRecording(batchSessionObj: BatchSessionModel): Observable<IAPIResponse> {
    return this.http.post<IAPIResponse>(environment.API_URL + APIMethods.BATCH_SESSIONS.CREATE_BATCH_SESSION, batchSessionObj)
      .pipe(tap(() => (this.sessionsCache$ = undefined)));
  }


   updateSessionRecording(sessionId: number, batchSessionObj: BatchSessionModel): Observable<IAPIResponse> {
      return this.http.put<IAPIResponse>(environment.API_URL + APIMethods.BATCH_SESSIONS.CREATE_BATCH_SESSION + sessionId, batchSessionObj)
      .pipe(tap(() => (this.sessionsCache$ = undefined)));
  
    }
  
    deleteSessionRecording(sessionId: number): Observable<IAPIResponse> {
      return this.http.delete<IAPIResponse>(environment.API_URL + APIMethods.BATCH_SESSIONS.CREATE_BATCH_SESSION + sessionId)
       .pipe(tap(() => (this.sessionsCache$ = undefined)));
    }

}


