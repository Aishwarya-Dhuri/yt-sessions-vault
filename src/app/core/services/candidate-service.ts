import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CandidateModel } from '../models/candiate.model';
import { IAPIResponse } from '../models/common.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiMethods } from '../constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  
   http = inject(HttpClient)

  createNewCandidate(candidateObj:CandidateModel):Observable<IAPIResponse>{
   return this.http.post<IAPIResponse>(environment.API_URL+ApiMethods.CANDIDATES.CREATE_CANDIDATE,candidateObj)
  }

  getAllCandidates():Observable<IAPIResponse>{
    return this.http.get<IAPIResponse>(environment.API_URL+ApiMethods.CANDIDATES.GET_CANDIDATES)
  }
  

  updateCandidate(candidateId: number, candidateObj: CandidateModel):Observable<IAPIResponse>{
    //console.warn(environment.API_URL+ApiMethods.UPDATE_BATCH+candidateId);
    return this.http.put<IAPIResponse>(environment.API_URL+ApiMethods.CANDIDATES.CREATE_CANDIDATE+candidateId,candidateObj)
    
  }

   deleteCandidate(candidateId: number):Observable<IAPIResponse>{
    return this.http.delete<IAPIResponse>(environment.API_URL+ApiMethods.CANDIDATES.CREATE_CANDIDATE+candidateId)
  }
}
