import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ExamEntryComponent } from '../exam-entry/exam-entry.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { AuthService } from '../../../shared/services/auth.service';
import { ApiService } from '../../../shared/services/api.service';
import { ExamService } from '../../../shared/services/exam.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    ExamEntryComponent,
    NavBarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  testResult: any = null;
  examTestResult: any = null;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    private readonly  examService: ExamService
  ) {}

  ngOnInit(): void {
    console.log('Student Dashboard loaded');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  testApiCall(): void {
    console.log('Testing API call...');
    // This endpoint might return 401 if token is expired, triggering refresh
    this.apiService.get('/Authentication/me').subscribe({
      next: (response) => {
        console.log('API call successful:', response);
        this.testResult = response;
      },
      error: (error) => {
        console.log('API call failed:', error);
        this.testResult = { error: error.message };
      }
    });
  }

  testExamApiCall(): void {
    console.log('Testing Exam API call...');
    // Test the exam display endpoint with exam ID 3
    this.examService.getExamDisplay(3).subscribe({
      next: (response) => {
        console.log('Exam API call successful:', response);
        this.examTestResult = response;
      },
      error: (error) => {
        console.log('Exam API call failed:', error);
        this.examTestResult = { error: error.message };
      }
    });
  }
}
