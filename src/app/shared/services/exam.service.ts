import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  Exam, 
  ExamCreatePayload, 
  Submission, 
  SubmissionPayload, 
  SubmissionDetail, 
  StudentResult,
  ApiResponse,
  ArrayResponse,
  QuestionBank,
  ExamDisplayResponse
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  constructor(private readonly apiService: ApiService) {}

  // Get all exams - API returns simple array, not paginated
  getExams(page: number = 1): Observable<Exam[]> {
    return this.apiService.get<ArrayResponse<Exam>>('/Exams', { page })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch exams');
          }
          return response.data;
        })
      );
  }

  // Get exam by ID
  getExamById(id: number): Observable<Exam> {
    return this.apiService.get<ApiResponse<Exam>>(`/Exams/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch exam');
          }
          return response.data;
        })
      );
  }

  // Get exam display (with questions) for taking
  getExamDisplay(id: number): Observable<QuestionBank[]> {
    return this.apiService.get<ExamDisplayResponse>(`/Exams/${id}/display`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch exam display');
          }
          return response.data;
        })
      );
  }

  // Create new exam
  createExam(examData: ExamCreatePayload): Observable<Exam> {
    return this.apiService.post<ApiResponse<Exam>>('/Exams', examData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to create exam');
          }
          return response.data;
        })
      );
  }

  // Update exam
  updateExam(id: number, examDate: string, endDate: string): Observable<Exam> {
    return this.apiService.put<ApiResponse<Exam>>('/Exams', null, { 
      Id: id, 
      ExamDate: examDate, 
      EndDate: endDate 
    })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to update exam');
          }
          return response.data;
        })
      );
  }

  // Delete exam
  deleteExam(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>('/Exams', { id })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to delete exam');
          }
        })
      );
  }

  // Get student results
  getStudentResults(studentId: number, examId: number): Observable<StudentResult> {
    return this.apiService.get<ApiResponse<StudentResult>>('/Exams/student-results', { 
      studentId, 
      examId 
    })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch student results');
          }
          return response.data;
        })
      );
  }

  // Get all submissions with pagination
  getSubmissions(page: number = 1): Observable<ApiResponse<Submission[]>> {
    return this.apiService.get<ApiResponse<Submission[]>>('/Submissions', { page });
  }

  // Get submission by ID
  getSubmissionById(id: number): Observable<ApiResponse<Submission>> {
    return this.apiService.get<ApiResponse<Submission>>(`/Submissions/${id}`);
  }

  // Get submission details
  getSubmissionDetails(id: number): Observable<ApiResponse<SubmissionDetail>> {
    return this.apiService.get<ApiResponse<SubmissionDetail>>(`/Submissions/${id}/details`);
  }

  // Submit exam answers
  submitExam(submissionData: SubmissionPayload): Observable<ApiResponse<Submission>> {
    return this.apiService.post<ApiResponse<Submission>>('/Submissions', submissionData);
  }

  // Delete submission
  deleteSubmission(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>('/Submissions', { id });
  }
} 