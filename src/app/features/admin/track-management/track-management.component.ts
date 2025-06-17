import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { TrackService } from '../../../shared/services/track.service';
import { BranchService } from '../../../shared/services/branch.service';
import { Track, TrackDTO, Branch } from '../../../shared/interfaces/api.interface';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-track-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    BadgeModule,
    TooltipModule,
    NavBarComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './track-management.component.html',
  styleUrls: ['./track-management.component.css']
})
export class TrackManagementComponent implements OnInit {
  tracks: Track[] = [];
  branches: Branch[] = [];
  selectedTrack: Track | null = null;
  trackDialogVisible = false;
  
  isLoading = true;
  error: string | null = null;
  
  // Forms
  trackForm: FormGroup;
  
  // Pagination
  currentPage = 1;
  totalRecords = 0;
  rowsPerPage = 10;
  
  // Filtering
  searchTerm = '';
  selectedBranch: number | null = null;

  constructor(
    private trackService: TrackService,
    private branchService: BranchService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.trackForm = this.formBuilder.group({
      branchId: ['', Validators.required],
      trackName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadBranches().then(() => {
      this.loadTracks();
    });
  }

  private async loadTracks(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await this.trackService.getTracks(this.currentPage).toPromise();
      if (response) {
        // Map trackID to id and branchID to branchId if needed
        this.tracks = response.map((track: any) => ({
          ...track,
          id: track.id ?? track.trackID,
          branchId: track.branchId ?? track.branchID
        }));
        this.totalRecords = this.tracks.length;
      }
    } catch (error) {
      this.error = 'Failed to load tracks';
      console.error('Error loading tracks:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadBranches(): Promise<void> {
    try {
      const response = await this.branchService.getBranches(1).toPromise();
      if (response) {
        // Map branchID to id to match the interface
        this.branches = response.map((branch: any) => ({
          ...branch,
          id: branch.id ?? branch.branchID
        }));
      }
    } catch (error) {
      console.error('Error loading branches:', error);
    }
  }

  // Track Management
  openNewTrack(): void {
    this.selectedTrack = null;
    this.trackForm.reset();
    this.trackDialogVisible = true;
  }

  editTrack(track: Track): void {
    this.selectedTrack = track;
    this.trackForm.patchValue({
      branchId: track.branchId,
      trackName: track.trackName
    });
    this.trackDialogVisible = true;
  }

  async saveTrack(): Promise<void> {
    if (this.trackForm.invalid) {
      this.markFormGroupTouched(this.trackForm);
      return;
    }

    try {
      const trackData: TrackDTO = this.trackForm.value;
      
      if (this.selectedTrack) {
        // Update existing track
        await this.trackService.updateTrack(this.selectedTrack.id, trackData).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Track updated successfully'
        });
      } else {
        // Create new track
        await this.trackService.createTrack(trackData).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Track created successfully'
        });
      }
      
      this.trackDialogVisible = false;
      this.loadTracks();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save track'
      });
      console.error('Error saving track:', error);
    }
  }

  deleteTrack(track: Track): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the track "${track.trackName}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performDeleteTrack(track.id);
      }
    });
  }

  private async performDeleteTrack(trackId: number): Promise<void> {
    try {
      await this.trackService.deleteTrack(trackId).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Track deleted successfully'
      });
      this.loadTracks();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete track'
      });
      console.error('Error deleting track:', error);
    }
  }

  // Filtering methods
  get filteredTracks(): Track[] {
    let filtered = this.tracks;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(track => 
        track.trackName.toLowerCase().includes(term)
      );
    }

    if (this.selectedBranch) {
      filtered = filtered.filter(track => track.branchId === this.selectedBranch);
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedBranch = null;
  }

  // Utility methods
  getBranchName(branchId?: number): string {
    if (!branchId) return 'Not Assigned';
    const branch = this.branches.find(b => b.id === branchId);
    return branch?.branchName || 'Unknown Branch';
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.loadTracks();
  }

  navigateBack(): void {
    this.router.navigate(['/admin']);
  }

  onCancel(): void {
    this.trackDialogVisible = false;
    this.trackForm.reset();
  }
} 