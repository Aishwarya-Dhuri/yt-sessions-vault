import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CandidateModel } from '../models/candiate.model';
import { IAPIResponse } from '../models/common.model';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiMethods } from '../constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {

  http = inject(HttpClient);

  private candidatesCache$?: Observable<IAPIResponse>;


  createNewCandidate(candidateObj: CandidateModel): Observable<IAPIResponse> {
    return this.http.post<IAPIResponse>(environment.API_URL + ApiMethods.CANDIDATES.CREATE_CANDIDATE, candidateObj)
      .pipe(tap(() => (this.candidatesCache$ = undefined)));
  }

  getAllCandidates(): Observable<IAPIResponse> {
    if (!this.candidatesCache$) {
      this.candidatesCache$ = this.http
        .get<IAPIResponse>(
          environment.API_URL + ApiMethods.CANDIDATES.GET_CANDIDATES
        )
        .pipe(shareReplay(1));
    }
    return this.candidatesCache$;


  }


  updateCandidate(candidateId: number, candidateObj: CandidateModel): Observable<IAPIResponse> {
    return this.http.put<IAPIResponse>(environment.API_URL + ApiMethods.CANDIDATES.CREATE_CANDIDATE + candidateId, candidateObj)
      .pipe(tap(() => (this.candidatesCache$ = undefined)));
  }

  deleteCandidate(candidateId: number): Observable<IAPIResponse> {
    return this.http.delete<IAPIResponse>(environment.API_URL + ApiMethods.CANDIDATES.CREATE_CANDIDATE + candidateId)
      .pipe(tap(() => (this.candidatesCache$ = undefined)));
  }
}
