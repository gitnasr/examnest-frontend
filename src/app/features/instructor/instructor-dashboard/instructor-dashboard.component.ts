import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { ExamService } from '../../../shared/services/exam.service';
import { CourseService } from '../../../shared/services/course.service';
import { QuestionBankService } from '../../../shared/services/question-bank.service';
import { StudentService } from '../../../shared/services/student.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Exam, Course, QuestionBank, Student, ApiResponse } from '../../../shared/interfaces/api.interface';

interface DashboardStats {
  totalExams: number;
  activeExams: number;
  totalCourses: number;
  totalQuestions: number;
  totalStudents: number;
  recentSubmissions: number;
}

interface RecentActivity {
  type: 'exam' | 'course' | 'question' | 'submission';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    ChartModule,
    TableModule,
    BadgeModule,
    AvatarModule,
    ProgressSpinnerModule,
    MessageModule,
    NavBarComponent
  ],
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalExams: 0,
    activeExams: 0,
    totalCourses: 0,
    totalQuestions: 0,
    totalStudents: 0,
    recentSubmissions: 0
  };

  recentExams: Exam[] = [];
  recentCourses: Course[] = [];
  recentStudents: Student[] = [];
  recentActivity: RecentActivity[] = [];
  
  isLoading = true;
  error: string | null = null;
  
  // Chart data
  examStatusData: any;
  examStatusOptions: any;
  submissionTrendData: any;
  submissionTrendOptions: any;

  constructor(
    private examService: ExamService,
    private courseService: CourseService,
    private questionBankService: QuestionBankService,
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.initializeCharts();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Load all data in parallel
    Promise.all([
      this.loadExams(),
      this.loadCourses(),
      this.loadQuestions(),
      this.loadStudents(),
      this.loadRecentActivity()
    ]).then(() => {
      this.calculateStats();
      this.isLoading = false;
    }).catch(error => {
      this.error = 'Failed to load dashboard data';
      this.isLoading = false;
      console.error('Dashboard loading error:', error);
    });
  }

  private async loadExams(): Promise<void> {
    try {
      const response = await this.examService.getExams(1).toPromise();
      if (response) {
        this.recentExams = response.slice(0, 5);
        this.stats.totalExams = response.length;
        this.stats.activeExams = response.filter((exam: Exam) => 
          new Date(exam.endDate) > new Date()
        ).length;
      }
    } catch (error) {
      console.error('Error loading exams:', error);
    }
  }

  private async loadCourses(): Promise<void> {
    try {
      const response = await this.courseService.getCourses(1).toPromise();
      if (response) {
        this.recentCourses = response.slice(0, 5);
        this.stats.totalCourses = response.length;
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  private async loadQuestions(): Promise<void> {
    try {
      const response = await this.questionBankService.getQuestions(1).toPromise();
      if (response) {
        this.stats.totalQuestions = 500;
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  }

  private async loadStudents(): Promise<void> {
    try {
      const response = await this.studentService.getStudents(1).toPromise();
      if (response) {
        this.recentStudents = response.slice(0, 5);
        this.stats.totalStudents = response.length;
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  private async loadRecentActivity(): Promise<void> {
    // Simulate recent activity - in a real app, this would come from an activity log API
    this.recentActivity = [
      {
        type: 'exam',
        title: 'New Exam Created',
        description: 'Introduction to Programming - Final Exam',
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      {
        type: 'submission',
        title: 'Exam Submission',
        description: 'Student completed Web Development exam',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'info'
      },
      {
        type: 'question',
        title: 'Question Added',
        description: 'Added new MCQ to Database course',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'success'
      }
    ];
  }

  private calculateStats(): void {
    // Stats are calculated in the individual load methods
  }

  private initializeCharts(): void {
    // Exam Status Chart
    this.examStatusData = {
      labels: ['Active', 'Upcoming', 'Completed'],
      datasets: [
        {
          data: [this.stats.activeExams, 2, 5],
          backgroundColor: ['#10B981', '#F59E0B', '#6B7280'],
          borderWidth: 0
        }
      ]
    };

    this.examStatusOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

  

   
  }

  // Navigation methods
  navigateToExamManagement(): void {
    this.router.navigate(['/instructor/exam-management']);
  }

  navigateToQuestionBank(): void {
    this.router.navigate(['/instructor/question-bank']);
  }

  navigateToStudents(): void {
    this.router.navigate(['/instructor/students']);
  }

  navigateToCourses(): void {
    this.router.navigate(['/instructor/courses']);
  }

  // Utility methods
  getExamStatus(exam: Exam): string {
    const now = new Date();
    const examDate = new Date(exam.examDate);
    const endDate = new Date(exam.endDate);
    
    if (now >= examDate && now <= endDate) return 'Active';
    if (now < examDate) return 'Upcoming';
    return 'Completed';
  }

  getStatusColor(status: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'Active': return 'success';
      case 'Upcoming': return 'warn';
      case 'Completed': return 'info';
      default: return 'secondary';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'exam': return 'pi pi-file-edit';
      case 'course': return 'pi pi-book';
      case 'question': return 'pi pi-question-circle';
      case 'submission': return 'pi pi-check-circle';
      default: return 'pi pi-info-circle';
    }
  }

  getActivityColor(status: string): string {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }
} 