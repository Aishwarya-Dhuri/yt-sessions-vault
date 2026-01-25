import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Header } from '../header/header';
import { Roles } from '../../core/enums/roles.enum';
import { GlobalConstants } from '../../core/constants/global.constants';
import { CandidateModel } from '../../core/models/candiate.model';
import { UserService } from '../../shared/services/user-service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Header,AsyncPipe,NgIf],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  sidebarOpen = signal(false);
  userSrv = inject(UserService);
  private router = inject(Router);
  rolesEnum = Roles;

  constructor() {

  }



  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }

  onLogoff() {
    this.userSrv.clearUser();
    this.router.navigate(['/login']);
  }
}


