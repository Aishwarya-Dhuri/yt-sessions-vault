import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CandidateModel } from '../../core/models/candiate.model';
import { APIMethods, GlobalConstants } from '../../core/constants/global.constants';
import { Roles } from '../../core/enums/roles.enum';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAPIResponse } from '../../core/models/common.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  loggedInUserData = signal<CandidateModel>(new CandidateModel());
  private http = inject(HttpClient);
  
  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const localData = localStorage.getItem(GlobalConstants.LOGIN_LOCAL_KEY);
    if (localData) {
      try {
        const userData = JSON.parse(localData) as CandidateModel;
        // Normalize role by trimming whitespace
        userData.role = userData.role?.trim() || '';
        this.loggedInUserData.set(userData);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    }
  }

  setLoggedInUser(userData: CandidateModel): void {
    // Normalize role by trimming whitespace
    userData.role = userData.role?.trim() || '';
    this.loggedInUserData.set(userData);
    localStorage.setItem(GlobalConstants.LOGIN_LOCAL_KEY, JSON.stringify(userData));
  }

  clearUser(): void {
    this.loggedInUserData.set(new CandidateModel());
    localStorage.removeItem(GlobalConstants.LOGIN_LOCAL_KEY);
  }

  login(email: string, password: string): Observable<string> {
    const loginPayload = { email, password };

    //console.log(environment.API_URL + APIMethods.LOGIN.AUTHENTICATE);
    return this.http.post<IAPIResponse>(environment.API_URL + APIMethods.LOGIN.AUTHENTICATE, loginPayload)
      .pipe(
        map(res => {
          // Store user data
          this.setLoggedInUser(res.data);
          
          // Determine route based on role
          const userRole = res.data.role?.trim();
          console.log('User role from API:', userRole);
          console.log('SUPER_ADMIN_ROLE constant:', Roles.SUPER_ADMIN_ROLE);
          
          const routePath = userRole === Roles.SUPER_ADMIN_ROLE ? 'home/admin-dashboard' : 'home/candidate-dashboard';
          console.log('Navigating to:', routePath);
          
          return routePath;
        })
      );
  }
}
