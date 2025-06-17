import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  Student, 
  UpdateDto, 
  ApiResponse, 
  ArrayResponse 
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private readonly apiService: ApiService) {}

  // Get all students - handle both paginated and non-paginated responses
  getStudents(page: number = 1): Observable<Student[]> {
    return this.apiService.get<ArrayResponse<Student>>('/Students', { page })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch students');
          }
          return response.data;
        })
      );
  }

  // Get student by ID
  getStudentById(id: number): Observable<Student> {
    return this.apiService.get<ApiResponse<Student>>(`/Students/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch student');
          }
          return response.data;
        })
      );
  }

  // Update student
  updateStudent(id: number, studentData: UpdateDto): Observable<Student> {
    return this.apiService.put<ApiResponse<Student>>('/Students', studentData, { id })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to update student');
          }
          return response.data;
        })
      );
  }

  // Delete student
  deleteStudent(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>('/Students', { id })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to delete student');
          }
        })
      );
  }
} 