import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { ExamService } from '../../../shared/services/exam.service';
import { CourseService } from '../../../shared/services/course.service';
import { Exam, ExamCreatePayload, Course, ApiResponse } from '../../../shared/interfaces/api.interface';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    DialogModule,
    MessageModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    ToastModule,
    BadgeModule,
    TooltipModule
  ],
  templateUrl: './exam-management.component.html',
  styleUrls: ['./exam-management.component.css']
})
export class ExamManagementComponent implements OnInit {
  exams: Exam[] = [];
  courses: Course[] = [];
  isLoading = true;
  showCreateDialog = false;
  isSubmitting = false;
  error: string | null = null;
  
  examForm: FormGroup;

  constructor(
    private examService: ExamService,
    private courseService: CourseService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.examForm = this.fb.group({
      courseId: ['', Validators.required],
      noOfQuestions: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
      examDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadExams();
    this.loadCourses();
  }

  private loadExams(): void {
    this.isLoading = true;
    this.examService.getExams(1).subscribe({
      next: (response: Exam[]) => {
        this.exams = response;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = error.message || 'Failed to load exams';
        this.isLoading = false;
      }
    });
  }

  private loadCourses(): void {
    this.courseService.getCourses(1).subscribe({
      next: (response: Course[]) => {
        // Map courseID to id if needed
        this.courses = response.map((course: any) => ({
          ...course,
          id: course.id ?? course.courseID
        }));
      },
      error: (error: any) => {
        console.error('Failed to load courses:', error);
        // Fallback to empty array if courses fail to load
        this.courses = [];
      }
    });
  }

  onCreateExam(): void {
    this.showCreateDialog = true;
    this.examForm.reset({
      noOfQuestions: 10
    });
  }

  onSubmitExam(): void {
    if (this.examForm.valid) {
      this.isSubmitting = true;
      const examData: ExamCreatePayload = {
        courseId: this.examForm.value.courseId,
        noOfQuestions: this.examForm.value.noOfQuestions,
        examDate: this.examForm.value.examDate.toISOString(),
        endDate: this.examForm.value.endDate.toISOString()
      };

      this.examService.createExam(examData).subscribe({
        next: (response: Exam) => {
          this.exams.unshift(response);
          this.isSubmitting = false;
          this.showCreateDialog = false;
          this.examForm.reset();
        },
        error: (error: any) => {
          this.error = error.message || 'Failed to create exam';
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancelCreate(): void {
    this.showCreateDialog = false;
    this.examForm.reset();
  }

  onDeleteExam(exam: Exam): void {
    if (confirm(`Are you sure you want to delete the exam "${exam.course?.courseName || 'Unknown'}"?`)) {
      this.examService.deleteExam(exam.id).subscribe({
        next: () => {
          this.exams = this.exams.filter(e => e.id !== exam.id);
        },
        error: (error: any) => {
          this.error = error.message || 'Failed to delete exam';
        }
      });
    }
  }

  getCourseName(courseId: number): string {
    const course = this.courses.find(c => c.courseID === courseId);
    return course?.courseName || 'Unknown Course';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  isExamActive(exam: Exam): boolean {
    const now = new Date();
    const examDate = new Date(exam.examDate);
    const endDate = new Date(exam.endDate);
    return now >= examDate && now <= endDate;
  }

  isExamUpcoming(exam: Exam): boolean {
    const now = new Date();
    const examDate = new Date(exam.examDate);
    return now < examDate;
  }

  isExamCompleted(exam: Exam): boolean {
    const now = new Date();
    const endDate = new Date(exam.endDate);
    return now > endDate;
  }

  getExamStatus(exam: Exam): string {
    if (this.isExamActive(exam)) return 'Active';
    if (this.isExamUpcoming(exam)) return 'Upcoming';
    if (this.isExamCompleted(exam)) return 'Completed';
    return 'Unknown';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'success';
      case 'Upcoming': return 'warning';
      case 'Completed': return 'info';
      default: return 'secondary';
    }
  }
} 