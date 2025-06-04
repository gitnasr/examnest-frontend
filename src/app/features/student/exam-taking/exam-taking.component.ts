import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { QuestionComponent } from './question/question.component';
import { TimerComponent } from './timer/timer.component';

// Define Question interface for typing (l7ad ma n3ml api call)
interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  selectedAnswer: string | null;
}

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
  ],
  templateUrl:  './exam-taking.component.html',
  styleUrls: ['./exam-taking.component.css'],
})
export class ExamTakingComponent implements OnInit {
  examData: {
    title: string;
    totalQuestions: number;
    endTime: Date;
    questions: Question[];
  } = {
    title: 'Nourleyy Exam',
    totalQuestions: 10,
    endTime: new Date(), 
    questions: [],
  };

  showSubmitDialog = false;
  isSubmitting = false;

  constructor() {}

  ngOnInit(): void {
    // Simulate API response with endTime
    this.loadExamData();
  }

  private loadExamData(): void {
    this.examData.endTime = new Date('2025-06-04 22:25:55'); 
    this.examData.questions = this.generateRandomQuestions();
  }
  private generateRandomQuestions(): Question[] {
    const questionBank = [
      {
        text: 'What is the capital of France?',
        options: [
          { id: 'A', text: 'London' },
          { id: 'B', text: 'Paris' },
          { id: 'C', text: 'Berlin' },
          { id: 'D', text: 'Madrid' },
        ],
      },
      {
        text: 'Which planet is known as the Red Planet?',
        options: [
          { id: 'A', text: 'Venus' },
          { id: 'B', text: 'Mars' },
          { id: 'C', text: 'Jupiter' },
          { id: 'D', text: 'Saturn' },
        ],
      },
      {
        text: 'What is the largest ocean on Earth?',
        options: [
          { id: 'A', text: 'Atlantic Ocean' },
          { id: 'B', text: 'Indian Ocean' },
          { id: 'C', text: 'Arctic Ocean' },
          { id: 'D', text: 'Pacific Ocean' },
        ],
      },
      {
        text: 'Who wrote the play "Romeo and Juliet"?',
        options: [
          { id: 'A', text: 'Charles Dickens' },
          { id: 'B', text: 'William Shakespeare' },
          { id: 'C', text: 'Jane Austen' },
          { id: 'D', text: 'Mark Twain' },
        ],
      },
      {
        text: 'What is the chemical symbol for gold?',
        options: [
          { id: 'A', text: 'Go' },
          { id: 'B', text: 'Gd' },
          { id: 'C', text: 'Au' },
          { id: 'D', text: 'Ag' },
        ],
      },
      {
        text: 'Which year did World War II end?',
        options: [
          { id: 'A', text: '1944' },
          { id: 'B', text: '1945' },
          { id: 'C', text: '1946' },
          { id: 'D', text: '1947' },
        ],
      },
      {
        text: 'What is the smallest prime number?',
        options: [
          { id: 'A', text: '1' },
          { id: 'B', text: '2' },
          { id: 'C', text: '3' },
          { id: 'D', text: '5' },
        ],
      },
      {
        text: 'Which continent is the largest by area?',
        options: [
          { id: 'A', text: 'Africa' },
          { id: 'B', text: 'Asia' },
          { id: 'C', text: 'North America' },
          { id: 'D', text: 'Europe' },
        ],
      },
      {
        text: 'What is the speed of light in vacuum?',
        options: [
          { id: 'A', text: '299,792,458 m/s' },
          { id: 'B', text: '300,000,000 m/s' },
          { id: 'C', text: '299,000,000 m/s' },
          { id: 'D', text: '298,792,458 m/s' },
        ],
      },
      {
        text: 'Who painted the Mona Lisa?',
        options: [
          { id: 'A', text: 'Vincent van Gogh' },
          { id: 'B', text: 'Pablo Picasso' },
          { id: 'C', text: 'Leonardo da Vinci' },
          { id: 'D', text: 'Michelangelo' },
        ],
      },
    ];

    // Shuffle the question bank and take the required number of questions
    const shuffled = questionBank.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, this.examData.totalQuestions);

    return selectedQuestions.map((q, idx) => ({
      id: idx + 1,
      text: q.text,
      options: q.options,
      selectedAnswer: null,
    }));
  }
  onAnswerSelect(questionId: number, answerId: string): void {
    const question = this.examData.questions.find((q) => q.id === questionId);
    if (question) {
      question.selectedAnswer = answerId; 
    }
  }

  onSubmitExam(): void {
    const unansweredQuestions = this.getUnansweredQuestions();
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

    setTimeout(() => {
      console.log('Submitting exam...');
      console.log(
        'Exam answers:',
        this.examData.questions.map((q) => ({
          questionId: q.id,
          selectedAnswer: q.selectedAnswer,
        }))
      );

      this.isSubmitting = false;
     
    }, 2000);
  }

  onTimeExpired(): void {
    // Auto submit exam 
    console.log('Time expired! Auto-submitting exam...');
    this.performSubmission();
  }

  getProgress(): number {
    const answeredQuestions = this.examData.questions.filter(
      (q) => q.selectedAnswer !== null
    ).length;
    return (answeredQuestions / this.examData.totalQuestions) * 100;
  }

  getAnsweredCount(): number {
    return this.examData.questions.filter((q) => q.selectedAnswer !== null)
      .length;
  }

  getUnansweredQuestions(): Question[] {
    return this.examData.questions.filter((q) => q.selectedAnswer === null);
  }

  canSubmit(): boolean {
    return this.getAnsweredCount() === this.examData.totalQuestions;
  }

  
}
