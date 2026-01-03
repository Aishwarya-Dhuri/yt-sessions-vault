import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  sidebarOpen = signal(false);
  private router = inject(Router);

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }

  onLogoff() {
    // Handle logoff logic, e.g., clear session
    this.router.navigate(['/login']);
  }
}
