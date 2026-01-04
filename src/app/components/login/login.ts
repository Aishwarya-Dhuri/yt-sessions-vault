import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from '../../core/models/login.model';
import { GlobalConstants } from '../../core/constants/global.constants';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginObj: LoginModel = {
    email: '',
    password: ''
  };
    showPassword = signal(false);

  router = inject(Router);
  http = inject(HttpClient);


  onLogin() {

    this.http.post('https://feestracking.freeprojectapi.com/api/BatchUser/login', this.loginObj).subscribe({
      next: (res: any) => {
        localStorage.setItem(GlobalConstants.LOGIN_LOCAL_KEY, JSON.stringify(res.data));
        this.router.navigateByUrl('home/dashboard');

      }, error(err) {
        alert(err.error.message);
      }

    });

  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }
}

