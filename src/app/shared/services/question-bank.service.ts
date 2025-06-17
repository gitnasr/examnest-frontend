import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  QuestionBank, 
  Choice, 
  QuestionBankDTO, 
  ChoiceDTO, 
  ApiResponse, 
  ArrayResponse 
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionBankService {
  constructor(private readonly apiService: ApiService) {}

  // Get all questions - handle both paginated and non-paginated responses
  getQuestions(page: number = 1): Observable<QuestionBank[]> {
    return this.apiService.get<ArrayResponse<QuestionBank>>('/QuestionBank', { page })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch questions');
          }
          return response.data;
        })
      );
  }

  // Get question by ID
  getQuestionById(id: number): Observable<QuestionBank> {
    return this.apiService.get<ApiResponse<QuestionBank>>(`/QuestionBank/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch question');
          }
          return response.data;
        })
      );
  }

  // Get choices for a specific question
  getQuestionChoices(id: number): Observable<Choice[]> {
    return this.apiService.get<ArrayResponse<Choice>>(`/QuestionBank/${id}/choices`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch question choices');
          }
          return response.data;
        })
      );
  }

  // Create new question
  createQuestion(questionData: QuestionBankDTO): Observable<QuestionBank> {
    return this.apiService.post<ApiResponse<QuestionBank>>('/QuestionBank', questionData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to create question');
          }
          return response.data;
        })
      );
  }

  // Update question
  updateQuestion(id: number, questionData: QuestionBankDTO): Observable<QuestionBank> {
    return this.apiService.put<ApiResponse<QuestionBank>>('/QuestionBank', questionData, { id })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to update question');
          }
          return response.data;
        })
      );
  }

  // Delete question
  deleteQuestion(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>('/QuestionBank', { id })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to delete question');
          }
        })
      );
  }

  // Create choice
  createChoice(choiceData: ChoiceDTO): Observable<Choice> {
    return this.apiService.post<ApiResponse<Choice>>('/Choices', choiceData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to create choice');
          }
          return response.data;
        })
      );
  }

  // Update choice
  updateChoice(id: number, choiceData: ChoiceDTO): Observable<Choice> {
    return this.apiService.put<ApiResponse<Choice>>('/Choices', choiceData, { id })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to update choice');
          }
          return response.data;
        })
      );
  }

  // Delete choice
  deleteChoice(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>('/Choices', { id })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to delete choice');
          }
        })
      );
  }

  // Get choice by ID
  getChoiceById(id: number): Observable<Choice> {
    return this.apiService.get<ApiResponse<Choice>>(`/Choices/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch choice');
          }
          return response.data;
        })
      );
  }
} 