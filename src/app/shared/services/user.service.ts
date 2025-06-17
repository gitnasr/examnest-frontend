import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  UserInfo, 
  ApiResponse 
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly apiService: ApiService) {}

  // Get current user profile
  getCurrentUser(): Observable<UserInfo> {
    return this.apiService.get<ApiResponse<UserInfo>>('/Authentication/me')
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch user profile');
          }
          return response.data;
        })
      );
  }

  // Update user profile (if the API supports it)
  updateProfile(profileData: Partial<UserInfo>): Observable<UserInfo> {
    return this.apiService.put<ApiResponse<UserInfo>>('/Authentication/me', profileData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to update user profile');
          }
          return response.data;
        })
      );
  }
}
