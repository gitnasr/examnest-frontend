import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';

export interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  selectedAnswer: string | null;
}

export interface ExamData {
  title: string;
  totalQuestions: number;
  endTime: Date;
  questions: Question[];
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private questionBank = [
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



  getExamData(examId: string): Observable<ExamData> {
    
    return of({
      title: 'Sample Exam',
      totalQuestions: 10,
      endTime: new Date('2025-06-07 02:25:55'),
      questions: this.generateRandomQuestions(10)
    });
  }

  generateRandomQuestions(totalQuestions: number): Question[] {
    const shuffled = this.questionBank.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, totalQuestions);

    return selectedQuestions.map((q, idx) => ({
      id: idx + 1,
      text: q.text,
      options: q.options,
      selectedAnswer: null,
    }));
  }

  getProgress(questions: Question[]): number {
    const answeredQuestions = questions.filter(
      (q) => q.selectedAnswer !== null
    ).length;
    return (answeredQuestions / questions.length) * 100;
  }

  getAnsweredCount(questions: Question[]): number {
    return questions.filter((q) => q.selectedAnswer !== null).length;
  }

  getUnansweredQuestions(questions: Question[]): Question[] {
    return questions.filter((q) => q.selectedAnswer === null);
  }

  canSubmit(questions: Question[]): boolean {
    return this.getAnsweredCount(questions) === questions.length;
  }

  submitExam(examId: string, answers: { questionId: number; selectedAnswer: string }[]): Observable<void> {
    // This is a placeholder - replace with actual API call
    return of(void 0);
  }
} 