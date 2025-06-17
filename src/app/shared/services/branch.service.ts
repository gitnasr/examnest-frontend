import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  Branch, 
  BranchDTO, 
  ApiResponse, 
  ArrayResponse 
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  constructor(private readonly apiService: ApiService) {}

  // Get all branches - handle both paginated and non-paginated responses
  getBranches(page: number = 1): Observable<Branch[]> {
    return this.apiService.get<ArrayResponse<Branch>>('/Branches', { page })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch branches');
          }
          return response.data;
        })
      );
  }

  // Get branch by ID
  getBranchById(id: number): Observable<Branch> {
    return this.apiService.get<ApiResponse<Branch>>(`/Branches/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch branch');
          }
          return response.data;
        })
      );
  }

  // Create new branch
  createBranch(branchData: BranchDTO): Observable<Branch> {
    return this.apiService.post<ApiResponse<Branch>>('/Branches', branchData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to create branch');
          }
          return response.data;
        })
      );
  }

  // Update branch
  updateBranch(id: number, branchData: BranchDTO): Observable<Branch> {
    return this.apiService.put<ApiResponse<Branch>>('/Branches', branchData, { id })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to update branch');
          }
          return response.data;
        })
      );
  }

  // Delete branch
  deleteBranch(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>('/Branches', { id })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to delete branch');
          }
        })
      );
  }
} 