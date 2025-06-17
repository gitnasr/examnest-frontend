import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  UpgradeDTO, 
  ApiResponse 
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {
  constructor(private apiService: ApiService) {}

  upgradeUser(upgradeData: UpgradeDTO): Observable<void> {
    return this.apiService.post<ApiResponse<void>>('/Management/upgrade', upgradeData)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to upgrade user');
          }
        })
      );
  }
} 