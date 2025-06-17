import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  Instructor, 
  UpdateDto, 
  ApiResponse, 
  ArrayResponse 
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  constructor(private apiService: ApiService) {}

  getInstructors(page: number = 1): Observable<Instructor[]> {
    return this.apiService.get<ArrayResponse<Instructor>>('/Instructors', { page })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch instructors');
          }
          return response.data;
        })
      );
  }

  getInstructorById(id: number): Observable<Instructor> {
    return this.apiService.get<ApiResponse<Instructor>>(`/Instructors/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch instructor');
          }
          return response.data;
        })
      );
  }

  updateInstructor(id: number, updateData: UpdateDto): Observable<Instructor> {
    return this.apiService.put<ApiResponse<Instructor>>('/Instructors', updateData, { id })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to update instructor');
          }
          return response.data;
        })
      );
  }

  deleteInstructor(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>('/Instructors', { id })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to delete instructor');
          }
        })
      );
  }
} 