import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from '../../core/constants/global.constants';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  toggleSidebar = output<void>();
    private router = inject(Router); // Inject Router as a service

  loggedInUserData :any;
  username = 'John Doe'; // Placeholder, should be from service
  
  constructor(){
    const localData = localStorage.getItem(GlobalConstants.LOGIN_LOCAL_KEY);
    if(localData != null){
      this.loggedInUserData = JSON.parse(localData);

    }
  }

  logoff(){
    localStorage.removeItem(GlobalConstants.LOGIN_LOCAL_KEY);
    this.router.navigate(['login'])

  }
}
