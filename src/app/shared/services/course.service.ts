import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  Course, 
  CourseDTO, 
  ApiResponse, 
  ArrayResponse 
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private apiService: ApiService) {}

  // Get all courses - handle both paginated and non-paginated responses
  getCourses(page: number = 1): Observable<Course[]> {
    return this.apiService.get<ArrayResponse<Course>>('/Courses', { page })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch courses');
          }
          return response.data;
        })
      );
  }

  // Get course by ID
  getCourseById(id: number): Observable<Course> {
    return this.apiService.get<ApiResponse<Course>>(`/Courses/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch course');
          }
          return response.data;
        })
      );
  }

  // Create new course
  createCourse(courseData: CourseDTO): Observable<Course> {
    return this.apiService.post<ApiResponse<Course>>('/Courses', courseData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to create course');
          }
          return response.data;
        })
      );
  }

  // Update course
  updateCourse(id: number, courseData: CourseDTO): Observable<Course> {
    return this.apiService.put<ApiResponse<Course>>('/Courses', courseData, { id })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to update course');
          }
          return response.data;
        })
      );
  }

  // Delete course
  deleteCourse(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>('/Courses', { id })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to delete course');
          }
        })
      );
  }
} 