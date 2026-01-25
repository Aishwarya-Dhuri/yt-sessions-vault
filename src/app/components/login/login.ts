import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from '../../core/models/login.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../shared/services/user-service';

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
  userService = inject(UserService);

  constructor(private toastr: ToastrService) {
  }


  onLogin() {
    this.userService.login(this.loginObj.email, this.loginObj.password).subscribe({
      next: (routePath: string) => {
        this.router.navigateByUrl(routePath);
        this.toastr.success('Login success');
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Login failed');
      }
    });
  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }
}

