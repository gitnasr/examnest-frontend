import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  Submission, 
  SubmissionDetail, 
  SubmissionPayload, 
  ApiResponse, 
  ArrayResponse 
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  constructor(private apiService: ApiService) {}

  getSubmissions(page: number = 1): Observable<Submission[]> {
    return this.apiService.get<ArrayResponse<Submission>>('/Submissions', { page })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch submissions');
          }
          return response.data;
        })
      );
  }

  getSubmissionById(id: number): Observable<Submission> {
    return this.apiService.get<ApiResponse<Submission>>(`/Submissions/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch submission');
          }
          return response.data;
        })
      );
  }

  getSubmissionDetails(id: number): Observable<SubmissionDetail> {
    return this.apiService.get<ApiResponse<SubmissionDetail>>(`/Submissions/${id}/details`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch submission details');
          }
          return response.data;
        })
      );
  }

  createSubmission(submissionData: SubmissionPayload): Observable<Submission> {
    return this.apiService.post<ApiResponse<Submission>>('/Submissions', submissionData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to create submission');
          }
          return response.data;
        })
      );
  }

  deleteSubmission(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>('/Submissions', { id })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to delete submission');
          }
        })
      );
  }
} 