import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FormInputComponent, RouterModule]
})
export class AuthComponent {
  activeTab: 'login' | 'register' = 'login';
  
  loginForm = {
    email: '',
    password: ''
  };

  registerForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword:""
  };

  onLogin() {
    console.log('Login form submitted:', this.loginForm);
  }

  onRegister() {
    console.log('Register form submitted:', this.registerForm);
  }
}
