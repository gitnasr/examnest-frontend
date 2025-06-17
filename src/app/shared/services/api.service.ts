import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL = 'https://localhost:7238/api';

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<T>(`${this.API_BASE_URL}${endpoint}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.API_BASE_URL}${endpoint}`, data)
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, data: any, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.put<T>(`${this.API_BASE_URL}${endpoint}`, data, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.delete<T>(`${this.API_BASE_URL}${endpoint}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    // Don't handle 401 errors here - let the refresh token interceptor handle them
    if (error.status === 401) {
      return throwError(() => error);
    }

    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.errors && error.error.errors.length > 0) {
      errorMessage = error.error.errors[0];
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 403) {
      errorMessage = 'Access forbidden. You do not have permission to perform this action.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (error.status === 500) {
      errorMessage = 'Internal server error. Please try again later.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 