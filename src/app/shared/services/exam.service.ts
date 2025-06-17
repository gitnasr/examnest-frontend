import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Exam, 
  ExamCreatePayload, 
  ExamDisplay, 
  ExamDisplayResponse,
  Submission, 
  SubmissionPayload, 
  SubmissionDetail, 
  StudentResult,
} from '../interfaces/exam.interface';
import { ApiResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  constructor(private readonly apiService: ApiService) {}

  // Get all exams with pagination
  getExams(page: number = 1): Observable<ApiResponse<Exam[]>> {
    return this.apiService.get<ApiResponse<Exam[]>>('/Exams', { page });
  }

  // Get exam by ID
  getExamById(id: number): Observable<ApiResponse<Exam>> {
    return this.apiService.get<ApiResponse<Exam>>(`/Exams/${id}`);
  }

  // Get exam display (with questions) for taking
  getExamDisplay(id: number): Observable<ExamDisplayResponse> {
    return this.apiService.get<ExamDisplayResponse>(`/Exams/${id}/display`);
  }

  // Create new exam
  createExam(examData: ExamCreatePayload): Observable<ApiResponse<Exam>> {
    return this.apiService.post<ApiResponse<Exam>>('/Exams', examData);
  }

  // Update exam
  updateExam(id: number, examDate: string, endDate: string): Observable<ApiResponse<Exam>> {
    return this.apiService.put<ApiResponse<Exam>>('/Exams', null, { 
      Id: id, 
      ExamDate: examDate, 
      EndDate: endDate 
    });
  }

  // Delete exam
  deleteExam(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>('/Exams', { id });
  }

  // Get student results
  getStudentResults(studentId: number, examId: number): Observable<ApiResponse<StudentResult>> {
    return this.apiService.get<ApiResponse<StudentResult>>('/Exams/student-results', { 
      studentId, 
      examId 
    });
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