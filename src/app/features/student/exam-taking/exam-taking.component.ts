import { Component, OnInit } from '@angular/core';
import { ExamData, ExamService, Question } from '../services/exam.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ExamClosedComponent } from '../exam-closed/exam-closed.component';
import { QuestionComponent } from './question/question.component';
import { TimerComponent } from './timer/timer.component';

@Component({
  selector: 'app-exam-taking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    TimerComponent,
    QuestionComponent,
    ExamClosedComponent,
  ],
  templateUrl: './exam-taking.component.html',
  styleUrls: ['./exam-taking.component.css'],
})
export class ExamTakingComponent implements OnInit {
  examData: ExamData = {
    title: 'Loading Exam...',
    totalQuestions: 0,
    endTime: new Date(),
    questions: [],
  };

  showSubmitDialog = false;
  isSubmitting = false;
  isClosed = false;

  constructor(
    private readonly examService: ExamService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const examId = this.route.snapshot.paramMap.get('examId');
    if (examId) {
      this.loadExamData(examId);
    }
  }

  private loadExamData(examId: string): void {
    this.examService.getExamData(examId).subscribe(data => {
      this.examData = data;
      // Check if exam is closed
      this.isClosed = new Date() > data.endTime;
    });
  }

  onAnswerSelect(questionId: number, answerId: string): void {
    const question = this.examData.questions.find((q) => q.id === questionId);
    if (question) {
      question.selectedAnswer = answerId;
    }
  }

  onSubmitExam(): void {
    const unansweredQuestions = this.examService.getUnansweredQuestions(this.examData.questions);
    if (unansweredQuestions.length > 0) {
      this.showSubmitDialog = true;
      return;
    }

    this.performSubmission();
  }

  confirmSubmitWithUnanswered(): void {
    this.showSubmitDialog = false;
    this.performSubmission();
  }

  cancelSubmit(): void {
    this.showSubmitDialog = false;
  }

  private performSubmission(): void {
    this.isSubmitting = true;
    const examId = this.route.snapshot.paramMap.get('examId');
    
    if (!examId) return;

    const answers = this.examData.questions.map(q => ({
      questionId: q.id,
      selectedAnswer: q.selectedAnswer!
    }));

    this.examService.submitExam(examId, answers).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Handle successful submission (e.g., show success message, redirect)
      },
      error: (error) => {
        this.isSubmitting = false;
        // Handle error (e.g., show error message)
        console.error('Error submitting exam:', error);
      }
    });
  }

  onTimeExpired(): void {
    console.log('Time expired! Auto-submitting exam...');
    this.performSubmission();
  }

  getProgress(): number {
    return this.examService.getProgress(this.examData.questions);
  }

  getAnsweredCount(): number {
    return this.examService.getAnsweredCount(this.examData.questions);
  }

  getUnansweredQuestions(): Question[] {
    return this.examService.getUnansweredQuestions(this.examData.questions);
  }

  canSubmit(): boolean {
    return this.examService.canSubmit(this.examData.questions);
  }

  onReturnToDashboard(): void {
    this.router.navigate(['/student/dashboard']);
  }
}
