import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiMethods } from '../constants/global.constants';
import { IAPIResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class BatchSessionsService {
  http = inject(HttpClient);
  private sessionsCache$?: Observable<IAPIResponse>;


  getAllSessionsRecordings(): Observable<IAPIResponse> {
    if (!this.sessionsCache$) {
      this.sessionsCache$ = this.http.get<IAPIResponse>(environment.API_URL +
        ApiMethods.BATCH_SESSIONS.GET_ALL_SESSION_RECORDINGDS
      )
        .pipe(shareReplay(1));
    }
    return this.sessionsCache$;


  }
}


