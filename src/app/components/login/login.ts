import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from '../../core/models/login.model';
import { GlobalConstants } from '../../core/constants/global.constants';
import { ToastrService } from 'ngx-toastr';
import { Roles } from '../../core/enums/roles.enum';

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

  constructor(private toastr: ToastrService) {
  }


  onLogin() {

    this.http.post('https://feestracking.freeprojectapi.com/api/BatchUser/login', this.loginObj).subscribe({
      next: (res: any) => {
        localStorage.setItem(GlobalConstants.LOGIN_LOCAL_KEY, JSON.stringify(res.data));

        const userRole = res.data.role?.trim();
        console.log('User role from API:', userRole);
        console.log('SUPER_ADMIN_ROLE constant:', Roles.SUPER_ADMIN_ROLE);
        
        const routePath = userRole === Roles.SUPER_ADMIN_ROLE ? 'home/admin-dashboard' : 'home/candidate-dashboard';
        console.log('Navigating to:', routePath);
        
        this.router.navigateByUrl(routePath);
        this.toastr.success('Login  success');

      }, error: (err) => {
        this.toastr.error(
          err.error?.message
        );
      }

    });

  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }
}

