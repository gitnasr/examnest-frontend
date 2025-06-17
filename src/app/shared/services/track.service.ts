import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  Track, 
  TrackDTO, 
  ApiResponse, 
  ArrayResponse 
} from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  constructor(private readonly apiService: ApiService) {}

  // Get all tracks - handle both paginated and non-paginated responses
  getTracks(page: number = 1): Observable<Track[]> {
    return this.apiService.get<ArrayResponse<Track>>('/Tracks', { page })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch tracks');
          }
          return response.data;
        })
      );
  }

  // Get track by ID
  getTrackById(id: number): Observable<Track> {
    return this.apiService.get<ApiResponse<Track>>(`/Tracks/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to fetch track');
          }
          return response.data;
        })
      );
  }

  // Create new track
  createTrack(trackData: TrackDTO): Observable<Track> {
    return this.apiService.post<ApiResponse<Track>>('/Tracks', trackData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to create track');
          }
          return response.data;
        })
      );
  }

  // Update track
  updateTrack(id: number, trackData: TrackDTO): Observable<Track> {
    return this.apiService.put<ApiResponse<Track>>('/Tracks', trackData, { id })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to update track');
          }
          return response.data;
        })
      );
  }

  // Delete track
  deleteTrack(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>('/Tracks', { id })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to delete track');
          }
        })
      );
  }
} 