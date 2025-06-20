import { Observable, map, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { ExamService as SharedExamService } from '../../../shared/services/exam.service';
import { ExamAnswerDTO, SubmissionPayload, QuestionBank, Choice, Exam } from '../../../shared/interfaces/api.interface';

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
  constructor(private readonly sharedExamService: SharedExamService) {}

  getExamData(examId: string): Observable<ExamData> {
    const examIdNum = parseInt(examId);
    console.log("🚀 ~ ExamService ~ getExamData ~ examIdNum:", examIdNum)
    
    // Get both exam details and questions
    return forkJoin({
      examDetails: this.sharedExamService.getExamById(examIdNum),
      examQuestions: this.sharedExamService.getExamDisplay(examIdNum)
    }).pipe(
      map(({ examDetails, examQuestions }) => {
        if (!examQuestions || examQuestions.length === 0) {
          throw new Error('Exam questions not found');
        }

        const exam = examDetails;
        const questions: Question[] = examQuestions.map((q: QuestionBank) => ({
          id: q.questionId,
          text: q.questionText,
          options: q.choices?.map((c: Choice) => ({
            id: c.choiceLetter,
            text: c.choiceText
          })) || [],
          selectedAnswer: null
        }));

        // Validate that we have questions
        if (questions.length === 0) {
          throw new Error('No questions found for this exam');
        }

        // Set end time with fallback
        let endTime: Date;
        try {
          endTime = new Date(exam.endDate);
          // Validate the date
          if (isNaN(endTime.getTime())) {
            throw new Error('Invalid end date');
          }
        } catch (error) {
          // Fallback to 1 hour from now if end date is invalid
          endTime = new Date(Date.now() + 60 * 60 * 1000);
        }

        return {
          title: `Exam ${examId}`, // We can enhance this later if course info is available
          totalQuestions: questions.length,
          endTime: endTime,
          questions: questions
        };
      })
    );
  }

  getProgress(questions: Question[]): number {
    if (questions.length === 0) return 0;
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
    if (!answers || answers.length === 0) {
      throw new Error('No answers provided for submission');
    }

    const examAnswers: ExamAnswerDTO[] = answers.map(answer => ({
      questionID: answer.questionId,
      studentAnswer: answer.selectedAnswer
    }));

    const submissionPayload: SubmissionPayload = {
      examID: parseInt(examId),
      answers: examAnswers
    };

    return this.sharedExamService.submitExam(submissionPayload).pipe(
      map(() => void 0)
    );
  }
} 