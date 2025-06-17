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
import { UserService } from '../../../shared/services/user.service';
import { BranchService } from '../../../shared/services/branch.service';
import { TrackService } from '../../../shared/services/track.service';
import { CourseService } from '../../../shared/services/course.service';
import { ExamService } from '../../../shared/services/exam.service';
import { StudentService } from '../../../shared/services/student.service';
import { AuthService } from '../../../shared/services/auth.service';
import { UserInfo, Branch, Track, Course, Exam, Student, Roles } from '../../../shared/interfaces/api.interface';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalBranches: number;
  totalTracks: number;
  totalCourses: number;
  totalExams: number;
  recentRegistrations: number;
}

interface RecentActivity {
  type: 'user' | 'branch' | 'track' | 'course' | 'exam';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

@Component({
  selector: 'app-admin-dashboard',
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
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalBranches: 0,
    totalTracks: 0,
    totalCourses: 0,
    totalExams: 0,
    recentRegistrations: 0
  };

  recentUsers: UserInfo[] = [];
  recentBranches: Branch[] = [];
  recentTracks: Track[] = [];
  recentActivity: RecentActivity[] = [];
  
  isLoading = true;
  error: string | null = null;
  
  // Chart data
  userRoleData: any;
  userRoleOptions: any;
  registrationTrendData: any;
  registrationTrendOptions: any;
  systemUsageData: any;
  systemUsageOptions: any;

  constructor(
    private userService: UserService,
    private branchService: BranchService,
    private trackService: TrackService,
    private courseService: CourseService,
    private examService: ExamService,
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
      this.loadUsers(),
      this.loadBranches(),
      this.loadTracks(),
      this.loadCourses(),
      this.loadExams(),
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

  private async loadUsers(): Promise<void> {
    try {
      // For now, we'll simulate user data since we don't have a getAllUsers endpoint
      // In a real app, you'd have an admin service to get all users
      this.recentUsers = [
        {
          id: '1',
          email: 'admin@examnest.com',
          name: 'System Admin',
          role: Roles.Admin
        },
        {
          id: '2',
          email: 'instructor1@examnest.com',
          name: 'John Instructor',
          role: Roles.Instructor
        },
        {
          id: '3',
          email: 'student1@examnest.com',
          name: 'Alice Student',
          role: Roles.Student
        }
      ];
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  private async loadBranches(): Promise<void> {
    try {
      const response = await this.branchService.getBranches(1).toPromise();
      if (response) {
        this.recentBranches = response.slice(0, 5);
        this.stats.totalBranches = response.length;
      }
    } catch (error) {
      console.error('Error loading branches:', error);
    }
  }

  private async loadTracks(): Promise<void> {
    try {
      const response = await this.trackService.getTracks(1).toPromise();
      if (response) {
        this.recentTracks = response.slice(0, 5);
        this.stats.totalTracks = response.length;
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    }
  }

  private async loadCourses(): Promise<void> {
    try {
      const response = await this.courseService.getCourses(1).toPromise();
      if (response) {
        this.stats.totalCourses = response.length;
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  private async loadExams(): Promise<void> {
    try {
      const response = await this.examService.getExams(1).toPromise();
      if (response) {
        this.stats.totalExams = response.length;
      }
    } catch (error) {
      console.error('Error loading exams:', error);
    }
  }

  private async loadStudents(): Promise<void> {
    try {
      const response = await this.studentService.getStudents(1).toPromise();
      if (response) {
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
        type: 'user',
        title: 'New User Registration',
        description: 'Student registered: alice@example.com',
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      {
        type: 'branch',
        title: 'Branch Created',
        description: 'New branch: Cairo added to system',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'info'
      },
      {
        type: 'track',
        title: 'Track Updated',
        description: 'Web Development track modified',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'warning'
      },
      {
        type: 'exam',
        title: 'Exam Created',
        description: 'Final exam created for Database course',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        status: 'success'
      }
    ];
  }

  private calculateStats(): void {
    // Calculate user statistics
    this.stats.totalUsers = this.recentUsers.length;
    this.stats.totalInstructors = this.recentUsers.filter(user => user.role === Roles.Instructor).length;
    this.stats.recentRegistrations = this.recentActivity.filter(activity => activity.type === 'user').length;
  }

  private initializeCharts(): void {
    // User Role Distribution Chart
    this.userRoleData = {
      labels: ['Students', 'Instructors', 'Admins'],
      datasets: [
        {
          data: [this.stats.totalStudents, this.stats.totalInstructors, 1],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
          borderWidth: 0
        }
      ]
    };

    this.userRoleOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    // Registration Trend Chart
    this.registrationTrendData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'New Registrations',
          data: [5, 12, 8, 15, 10, 7, 13],
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4
        }
      ]
    };

    this.registrationTrendOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    // System Usage Chart
    this.systemUsageData = {
      labels: ['Branches', 'Tracks', 'Courses', 'Exams'],
      datasets: [
        {
          label: 'System Usage',
          data: [this.stats.totalBranches, this.stats.totalTracks, this.stats.totalCourses, this.stats.totalExams],
          backgroundColor: ['#EF4444', '#F97316', '#EAB308', '#84CC16'],
          borderWidth: 0
        }
      ]
    };

    this.systemUsageOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  // Navigation methods
  navigateToUserManagement(): void {
    this.router.navigate(['/admin/users']);
  }

  navigateToBranchManagement(): void {
    this.router.navigate(['/admin/branches']);
  }

  navigateToTrackManagement(): void {
    this.router.navigate(['/admin/tracks']);
  }

  // Utility methods
  getRoleLabel(role: Roles): string {
    switch (role) {
      case Roles.Student: return 'Student';
      case Roles.Instructor: return 'Instructor';
      case Roles.Admin: return 'Admin';
      case Roles.SuperAdmin: return 'Super Admin';
      default: return 'Unknown';
    }
  }

  getRoleColor(role: Roles): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    switch (role) {
      case Roles.Student: return 'info';
      case Roles.Instructor: return 'success';
      case Roles.Admin: return 'warn';
      case Roles.SuperAdmin: return 'danger';
      default: return 'secondary';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'user': return 'pi pi-user';
      case 'branch': return 'pi pi-building';
      case 'track': return 'pi pi-sitemap';
      case 'course': return 'pi pi-book';
      case 'exam': return 'pi pi-file-edit';
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