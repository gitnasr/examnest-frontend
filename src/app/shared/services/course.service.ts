import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Course } from '../interfaces/exam.interface';
import { ApiResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private apiService: ApiService) {}

  // Get all courses with pagination
  getCourses(page: number = 1): Observable<ApiResponse<Course[]>> {
    return this.apiService.get<ApiResponse<Course[]>>('/Courses', { page });
  }

  // Get course by ID
  getCourseById(id: number): Observable<ApiResponse<Course>> {
    return this.apiService.get<ApiResponse<Course>>(`/Courses/${id}`);
  }

  // Create new course
  createCourse(courseData: { trackId: number; courseName: string }): Observable<ApiResponse<Course>> {
    return this.apiService.post<ApiResponse<Course>>('/Courses', courseData);
  }

  // Update course
  updateCourse(id: number, courseData: { trackId: number; courseName: string }): Observable<ApiResponse<Course>> {
    return this.apiService.put<ApiResponse<Course>>('/Courses', courseData, { id });
  }

  // Delete course
  deleteCourse(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>('/Courses', { id });
  }
} 