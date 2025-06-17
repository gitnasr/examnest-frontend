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
import { CourseService } from '../../../shared/services/course.service';
import { TrackService } from '../../../shared/services/track.service';
import { Course, Track, CourseDTO } from '../../../shared/interfaces/api.interface';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-courses',
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
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  tracks: Track[] = [];
  selectedCourse: Course | null = null;
  courseDialogVisible = false;
  
  isLoading = true;
  error: string | null = null;
  
  // Forms
  courseForm: FormGroup;
  
  // Pagination
  currentPage = 1;
  totalRecords = 0;
  rowsPerPage = 10;
  
  // Filtering
  searchTerm = '';
  selectedTrack: Track | null = null;

  constructor(
    private courseService: CourseService,
    private trackService: TrackService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.courseForm = this.formBuilder.group({
      trackId: ['', Validators.required],
      courseName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadTracks();
  }

  private async loadCourses(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await this.courseService.getCourses(this.currentPage).toPromise();
      if (response) {
        this.courses = response;
        this.totalRecords = response.length; // In a real app, this would come from pagination metadata
      }
    } catch (error) {
      this.error = 'Failed to load courses';
      console.error('Error loading courses:', error);
    } finally {
      this.isLoading = false;
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

  // Course Management
  openNewCourse(): void {
    this.selectedCourse = null;
    this.courseForm.reset();
    this.courseDialogVisible = true;
  }

  editCourse(course: Course): void {
    this.selectedCourse = course;
    this.courseForm.patchValue({
      trackId: Number(course.trackID),
      courseName: course.courseName
    });
    this.courseDialogVisible = true;
  }

  async saveCourse(): Promise<void> {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched(this.courseForm);
      return;
    }

    try {
      const courseData: CourseDTO = {
        ...this.courseForm.value,
        trackId: Number(this.courseForm.value.trackId)
      };
      
      if (this.selectedCourse) {
        // Update existing course
        await this.courseService.updateCourse(this.selectedCourse.courseID, courseData).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Course updated successfully'
        });
      } else {
        // Create new course
        await this.courseService.createCourse(courseData).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Course created successfully'
        });
      }
      
      this.courseDialogVisible = false;
      this.loadCourses();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save course'
      });
      console.error('Error saving course:', error);
    }
  }

  deleteCourse(course: Course): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the course "${course.courseName}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performDeleteCourse(course.courseID);
      }
    });
  }

  private async performDeleteCourse(courseId: number): Promise<void> {
    try {
      await this.courseService.deleteCourse(courseId).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Course deleted successfully'
      });
      this.loadCourses();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete course'
      });
      console.error('Error deleting course:', error);
    }
  }

  // Filtering methods
  get filteredCourses(): Course[] {
    let filtered = this.courses;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.courseName.toLowerCase().includes(term)
      );
    }

    if (this.selectedTrack) {
      filtered = filtered.filter(course => course.trackID === this.selectedTrack?.id);
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedTrack = null;
  }

  // Utility methods
  getTrackName(trackId?: number): string {
    if (!trackId) return 'Not Assigned';
    const track = this.tracks.find(t => t.id === trackId);
    return track?.trackName || 'Unknown Track';
  }

  getBranchName(trackId?: number): string {
    if (!trackId) return 'Not Assigned';
    const track = this.tracks.find(t => t.id === trackId);
    return track?.branch?.branchName || 'Unknown Branch';
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.loadCourses();
  }

  navigateBack(): void {
    this.router.navigate(['/instructor']);
  }

  onCancel(): void {
    this.courseDialogVisible = false;
    this.courseForm.reset();
  }

  // New methods to use the API response data directly
  getCourseTrackName(course: Course): string {
    return course.trackName || 'Unknown Track';
  }

  getCourseBranchName(course: Course): string {
    return course.branchName || 'Unknown Branch';
  }
} 