import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FormInputComponent, RouterModule],
})
export class AuthComponent {
  activeTab: 'login' | 'register' = 'login';

  loginForm = {
    email: '',
    password: '',
  };

  registerForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private router: Router) {}
    // In the future we will determine which dashboard to navigate to based on user role

  onLogin() {
    console.log('Login form submitted:', this.loginForm);
    this.router.navigate(['/student']);
  }

  onRegister() {
    // Use a logging service to handle logs securely
   console.log('Register form submitted', { form: this.registerForm });

    this.router.navigate(['/student']);
  }
}
