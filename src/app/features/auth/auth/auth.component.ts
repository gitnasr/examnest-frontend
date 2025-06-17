import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { AuthService } from '../../../shared/services/auth.service';
import { AuthenticationDTO, RegisterDTO, Roles } from '../../../shared/interfaces/api.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FormInputComponent, RouterModule, ButtonModule, InputTextModule, CardModule, MessageModule, ProgressSpinnerModule],
})
export class AuthComponent implements OnInit {
  activeTab: 'login' | 'register' = 'login';
  isLoading = false;
  errorMessage = '';

  loginForm: AuthenticationDTO = {
    email: '',
    password: '',
  };

  registerForm: RegisterDTO & { confirmPassword: string } = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // The AuthRedirectGuard will handle redirecting authenticated users
  }

  onLogin(): void {
    if (!this.validateLoginForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.redirectBasedOnRole();
      },
      error: (error) => {
        this.isLoading = false;
        // Handle the specific error structure from the API
        if (error.error?.errors && error.error.errors.length > 0) {
          this.errorMessage = error.error.errors[0];
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }

  onRegister(): void {
    if (!this.validateRegisterForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const registerData: RegisterDTO = {
      name: this.registerForm.name,
      email: this.registerForm.email,
      password: this.registerForm.password
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.redirectBasedOnRole();
      },
      error: (error) => {
        this.isLoading = false;
        // Handle the specific error structure from the API
        if (error.error?.errors && error.error.errors.length > 0) {
          this.errorMessage = error.error.errors[0];
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }

  private validateLoginForm(): boolean {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return false;
    }

    if (!this.isValidEmail(this.loginForm.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }

    return true;
  }

  private validateRegisterForm(): boolean {
    if (!this.registerForm.name || !this.registerForm.email || 
        !this.registerForm.password || !this.registerForm.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields.';
      return false;
    }

    if (!this.isValidEmail(this.registerForm.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }

    if (this.registerForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return false;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUserValue();
    if (!user) {
      this.router.navigate(['/auth']);
      return;
    }

    switch (user.role) {
      case Roles.Student:
        this.router.navigate(['/student/dashboard']);
        break;
      case Roles.Instructor:
        this.router.navigate(['/instructor']);
        break;
      case Roles.Admin:
      case Roles.SuperAdmin:
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/student/dashboard']);
    }
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
