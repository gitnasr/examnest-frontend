import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ExamService } from '../../../shared/services/exam.service';
import { StudentResult, SubmissionDetail, ApiResponse } from '../../../shared/interfaces/api.interface';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    MessageModule,
    ProgressSpinnerModule
  ],
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.css']
})
export class ExamResultsComponent implements OnInit {
  examId: number | null = null;
  studentId: number | null = null;
  result: StudentResult | null = null;
  submissionDetail: SubmissionDetail | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private examService: ExamService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    console.log('ExamResultsComponent: Exam ID:', this.examId);
    const user = this.authService.getCurrentUserValue();
    
    if (user ) {
      this.studentId = parseInt(user.id);
      this.loadExamResults();
    } else {
      this.error = 'User not authenticated';
      this.isLoading = false;
    }
  }

  private loadExamResults(): void {
    this.examService.getStudentResults(22, this.examId!).subscribe({
      next: (response: StudentResult) => {
        this.result = response;
        this.loadSubmissionDetails();
      },
      error: (error: any) => {
        this.error = error.message || 'Failed to load exam results';
        this.isLoading = false;
      }
    });
  }

  private loadSubmissionDetails(): void {
    if (!this.examId) return;

    // Get the latest submission for this exam
    this.examService.getSubmissions(1).subscribe({
      next: (response: ApiResponse<SubmissionDetail[]>) => {
        if (response.data && response.data.length > 0) {
          const submission = response.data.find((s: SubmissionDetail) => s.examID === this.examId);
          if (submission) {
            this.examService.getSubmissionDetails(submission.id).subscribe({
              next: (detailResponse: ApiResponse<SubmissionDetail>) => {
                if (detailResponse.data) {
                  this.submissionDetail = detailResponse.data;
                }
                this.isLoading = false;
              },
              error: (error: any) => {
                console.error('Error loading submission details:', error);
                this.isLoading = false;
              }
            });
          } else {
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        console.error('Error loading submissions:', error);
        this.isLoading = false;
      }
    });
  }

  getScorePercentage(): number {
    if (!this.result) return 0;
    return (this.result.score / this.result.totalQuestions) * 100;
  }

  getScoreColor(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  }

  onBackToDashboard(): void {
    this.router.navigate(['/student/dashboard']);
  }

  onTakeAnotherExam(): void {
    this.router.navigate(['/student/exam-entry']);
  }
} 