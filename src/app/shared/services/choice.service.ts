import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  Choice, 
  ChoiceDTO, 
  ApiResponse 
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class ChoiceService {
  constructor(private apiService: ApiService) {}

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
} 