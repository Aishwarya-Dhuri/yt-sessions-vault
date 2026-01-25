import { Injectable } from '@angular/core';
import { CandidateModel } from '../../core/models/candiate.model';
import { GlobalConstants } from '../../core/constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
loggedInUserData : CandidateModel = new CandidateModel();
    constructor(){
      const localData = localStorage.getItem(GlobalConstants.LOGIN_LOCAL_KEY);
      if(localData != null){
        this.loggedInUserData = JSON.parse(localData);
  
      }
    }
}
