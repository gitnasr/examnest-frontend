import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  AuthService, 
  ExamService, 
  BranchService, 
  CourseService 
} from '../services';
import { Exam, Branch, Course, AuthResponse } from '../interfaces';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="api-test-container">
      <h2>API Integration Test</h2>
      
      <!-- Authentication Section -->
      <div class="section">
        <h3>Authentication</h3>
        <button (click)="testLogin()" [disabled]="isLoading">Test Login</button>
        <div *ngIf="authResult" class="result">
          <strong>Login Result:</strong> {{ authResult }}
        </div>
      </div>

      <!-- Exams Section -->
      <div class="section">
        <h3>Exams</h3>
        <button (click)="loadExams()" [disabled]="isLoading">Load Exams</button>
        <div *ngIf="exams.length > 0" class="result">
          <strong>Exams ({{ exams.length }}):</strong>
          <ul>
            <li *ngFor="let exam of exams">
              {{ exam.courseName }} - {{ exam.noOfQuestions }} questions
              ({{ exam.examDate | date:'short' }})
            </li>
          </ul>
        </div>
      </div>

      <!-- Branches Section -->
      <div class="section">
        <h3>Branches</h3>
        <button (click)="loadBranches()" [disabled]="isLoading">Load Branches</button>
        <div *ngIf="branches.length > 0" class="result">
          <strong>Branches ({{ branches.length }}):</strong>
          <ul>
            <li *ngFor="let branch of branches">
              {{ branch.branchName }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Courses Section -->
      <div class="section">
        <h3>Courses</h3>
        <button (click)="loadCourses()" [disabled]="isLoading">Load Courses</button>
        <div *ngIf="courses.length > 0" class="result">
          <strong>Courses ({{ courses.length }}):</strong>
          <ul>
            <li *ngFor="let course of courses">
              {{ course.courseName }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Error Display -->
      <div *ngIf="error" class="error">
        <strong>Error:</strong> {{ error }}
      </div>

      <!-- Loading Indicator -->
      <div *ngIf="isLoading" class="loading">
        Loading...
      </div>
    </div>
  `,
  styles: [`
    .api-test-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .section h3 {
      margin-top: 0;
      color: #333;
    }
    
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }
    
    button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    button:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .result {
      margin-top: 15px;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
    
    .result ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .result li {
      margin-bottom: 5px;
    }
    
    .error {
      margin-top: 15px;
      padding: 10px;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      color: #721c24;
    }
    
    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
      font-style: italic;
    }
  `]
})
export class ApiTestComponent implements OnInit {
  isLoading = false;
  error: string | null = null;
  authResult: string | null = null;
  exams: Exam[] = [];
  branches: Branch[] = [];
  courses: Course[] = [];

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private branchService: BranchService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.authResult = 'Already authenticated';
    }
  }

  testLogin(): void {
    this.isLoading = true;
    this.error = null;
    
    // Test with sample credentials (replace with actual test credentials)
    this.authService.login({
      email: 'test@example.com',
      password: 'password'
    }).subscribe({
      next: (response: AuthResponse) => {
        this.authResult = `Login successful: ${response.user.name} (${response.user.role})`;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  loadExams(): void {
    this.isLoading = true;
    this.error = null;
    
    this.examService.getExams(1).subscribe({
      next: (exams: Exam[]) => {
        this.exams = exams;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  loadBranches(): void {
    this.isLoading = true;
    this.error = null;
    
    this.branchService.getBranches(1).subscribe({
      next: (branches: Branch[]) => {
        this.branches = branches;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  loadCourses(): void {
    this.isLoading = true;
    this.error = null;
    
    this.courseService.getCourses(1).subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }
} 