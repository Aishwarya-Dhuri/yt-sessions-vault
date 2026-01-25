import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Header } from '../header/header';
import { Roles } from '../../core/enums/roles.enum';
import { GlobalConstants } from '../../core/constants/global.constants';
import { CandidateModel } from '../../core/models/candiate.model';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  sidebarOpen = signal(false);
  loggedInUserData = signal<CandidateModel | null>(null);
  private router = inject(Router);
  rolesEnum = Roles;

  constructor() {
    this.loadUserData();
  }

  private loadUserData() {
    const localData = localStorage.getItem(GlobalConstants.LOGIN_LOCAL_KEY);
    console.log(localData)
    if (localData != null) {
      try {
        this.loggedInUserData.set(JSON.parse(localData));
        console.log(JSON.parse(localData).role);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        this.loggedInUserData.set(null);
      }
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }

  onLogoff() {
    localStorage.removeItem(GlobalConstants.LOGIN_LOCAL_KEY);
    this.loggedInUserData.set(null);
    this.router.navigate(['/login']);
  }
}


