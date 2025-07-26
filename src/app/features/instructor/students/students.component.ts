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
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { StudentService } from '../../../shared/services/student.service';
import { BranchService } from '../../../shared/services/branch.service';
import { TrackService } from '../../../shared/services/track.service';
import { Student, Branch, Track, StudentUpdatePayload } from '../../../shared/interfaces/api.interface';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-students',
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
    AvatarModule,
    TooltipModule,
    NavBarComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  branches: Branch[] = [];
  tracks: Track[] = [];
  selectedStudent: Student | null = null;
  editDialogVisible = false;
  
  isLoading = true;
  error: string | null = null;
  
  // Forms
  editForm: FormGroup;
  
  // Pagination
  currentPage = 1;
  totalRecords = 0;
  rowsPerPage = 10;
  
  // Filtering
  searchTerm = '';
  selectedBranch: Branch | null = null;
  selectedTrack: Track | null = null;

  constructor(
    private studentService: StudentService,
    private branchService: BranchService,
    private trackService: TrackService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.editForm = this.formBuilder.group({
      branchId: ['', Validators.required],
      trackId: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadBranches();
    this.loadTracks();
  }

  private async loadStudents(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await this.studentService.getStudents(this.currentPage).toPromise();
      if (response) {
        this.students = response;
        this.totalRecords = response.length; // In a real app, this would come from pagination metadata
      }
    } catch (error) {
      this.error = 'Failed to load students';
      console.error('Error loading students:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadBranches(): Promise<void> {
    try {
      const response = await this.branchService.getBranches(1).toPromise();
      if (response) {
        this.branches = response.map((branch: any) => ({
          ...branch,
          id: branch.id ?? branch.branchID
        }));
      }
    } catch (error) {
      console.error('Error loading branches:', error);
    }
  }

  private async loadTracks(): Promise<void> {
    try {
      const response = await this.trackService.getTracks(1).toPromise();
      if (response) {
        this.tracks = response.map((track: any) => ({
          ...track,
          id: track.id ?? track.trackID
        }));
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    }
  }

  // Student Management
  editStudent(student: Student): void {
    this.selectedStudent = student;
    this.editForm.patchValue({
      branchName: student.branchName || '',
      trackName: student.trackName || '',
      userId: student.userId
    });
    this.editDialogVisible = true;
  }

  async saveStudent(): Promise<void> {
    if (this.editForm.invalid) {
      this.markFormGroupTouched(this.editForm);
      return;
    }

    if (!this.selectedStudent) return;

    try {
      const studentData: StudentUpdatePayload = this.editForm.value;
      await this.studentService.updateStudent(this.selectedStudent.id, studentData).toPromise();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Student updated successfully'
      });
      
      this.editDialogVisible = false;
      this.loadStudents();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update student'
      });
      console.error('Error updating student:', error);
    }
  }

  deleteStudent(student: Student): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the student "${student.user?.name || student.userId}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performDeleteStudent(student.id);
      }
    });
  }

  private async performDeleteStudent(studentId: number): Promise<void> {
    try {
      await this.studentService.deleteStudent(studentId).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Student deleted successfully'
      });
      this.loadStudents();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete student'
      });
      console.error('Error deleting student:', error);
    }
  }

  // Filtering methods
  get filteredStudents(): Student[] {
    let filtered = this.students;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.user?.name?.toLowerCase().includes(term) ||
        student.user?.email?.toLowerCase().includes(term) ||
        student.userId.toLowerCase().includes(term)
      );
    }

    if (this.selectedBranch) {
      filtered = filtered.filter(student => student.branchName === this.selectedBranch?.branchName);
    }

    if (this.selectedTrack) {
      filtered = filtered.filter(student => student.trackName === this.selectedTrack?.trackName);
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedBranch = null;
    this.selectedTrack = null;
  }

  // Utility methods
  getBranchName(branchId?: number): string {
    if (!branchId) return 'Not Assigned';
    const branch = this.branches.find(b => b.id === branchId);
    return branch?.branchName || 'Unknown Branch';
  }

  getTrackName(trackId?: number): string {
    if (!trackId) return 'Not Assigned';
    const track = this.tracks.find(t => t.id === trackId);
    return track?.trackName || 'Unknown Track';
  }

  getStudentInitials(student: Student): string {
    const name = student.user?.name || student.userId;
    return name.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase();
  }

  getStudentStatus(student: Student): string {
    if (student.branchName && student.trackName) return 'Active';
    if (student.branchName || student.trackName) return 'Partially Assigned';
    return 'Unassigned';
  }

  getStatusColor(status: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'Active': return 'success';
      case 'Partially Assigned': return 'warn';
      case 'Unassigned': return 'danger';
      default: return 'secondary';
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.loadStudents();
  }

  navigateBack(): void {
    this.router.navigate(['/instructor']);
  }

  // Branch change handler
  onBranchChange(): void {
    // Reset track selection when branch changes
    this.selectedTrack = null;
    this.editForm.patchValue({ trackId: '' });
  }

  // Get tracks filtered by selected branch
  getTracksForBranch(branchId?: number): Track[] {
    if (!branchId) return [];
    return this.tracks.filter(track => track.branchId === branchId);
  }
} 