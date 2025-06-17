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
import { UserService } from '../../../shared/services/user.service';
import { ManagementService } from '../../../shared/services/management.service';
import { BranchService } from '../../../shared/services/branch.service';
import { TrackService } from '../../../shared/services/track.service';
import { UserInfo, Branch, Track, Roles, UpgradeDTO } from '../../../shared/interfaces/api.interface';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-management',
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
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: UserInfo[] = [];
  branches: Branch[] = [];
  tracks: Track[] = [];
  selectedUser: UserInfo | null = null;
  upgradeDialogVisible = false;
  
  isLoading = true;
  error: string | null = null;
  
  // Forms
  upgradeForm: FormGroup;
  
  // Pagination
  currentPage = 1;
  totalRecords = 0;
  rowsPerPage = 10;
  
  // Filtering
  searchTerm = '';
  selectedRole: Roles | null = null;

  // Role options for dropdown
  roleOptions = [
    { label: 'Student', value: Roles.Student },
    { label: 'Instructor', value: Roles.Instructor },
    { label: 'Admin', value: Roles.Admin }
  ];

  constructor(
    private userService: UserService,
    private managementService: ManagementService,
    private branchService: BranchService,
    private trackService: TrackService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.upgradeForm = this.formBuilder.group({
      userId: ['', Validators.required],
      type: ['', Validators.required],
      trackId: [''],
      branchId: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadBranches();
    this.loadTracks();
  }

  private async loadUsers(): Promise<void> {
    try {
      this.isLoading = true;
      // For now, we'll simulate user data since we don't have a getAllUsers endpoint
      // In a real app, you'd have an admin service to get all users
      this.users = [
        {
          id: '1',
          email: 'admin@examnest.com',
          name: 'System Admin',
          role: Roles.Admin
        },
        {
          id: '2',
          email: 'instructor1@examnest.com',
          name: 'John Instructor',
          role: Roles.Instructor,
          branchId: 1,
          trackId: 1
        },
        {
          id: '3',
          email: 'student1@examnest.com',
          name: 'Alice Student',
          role: Roles.Student,
          branchId: 1,
          trackId: 1
        },
        {
          id: '4',
          email: 'student2@examnest.com',
          name: 'Bob Student',
          role: Roles.Student
        }
      ];
      this.totalRecords = this.users.length;
    } catch (error) {
      this.error = 'Failed to load users';
      console.error('Error loading users:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadBranches(): Promise<void> {
    try {
      const response = await this.branchService.getBranches(1).toPromise();
      if (response) {
        // Map branchID to id if needed
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
        // Map trackID to id if needed
        this.tracks = response.map((track: any) => ({
          ...track,
          id: track.id ?? track.trackID
        }));
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    }
  }

  // User Management
  upgradeUser(user: UserInfo): void {
    this.selectedUser = user;
    this.upgradeForm.patchValue({
      userId: user.id,
      type: user.role,
      trackId: user.trackId || '',
      branchId: user.branchId || ''
    });
    this.upgradeDialogVisible = true;
  }

  async saveUpgrade(): Promise<void> {
    if (this.upgradeForm.invalid) {
      this.markFormGroupTouched(this.upgradeForm);
      return;
    }

    try {
      const upgradeData: UpgradeDTO = this.upgradeForm.value;
      await this.managementService.upgradeUser(upgradeData).toPromise();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User role updated successfully'
      });
      
      this.upgradeDialogVisible = false;
      this.loadUsers(); // Reload users to get updated data
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update user role'
      });
      console.error('Error upgrading user:', error);
    }
  }

  deleteUser(user: UserInfo): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the user "${user.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performDeleteUser(user.id);
      }
    });
  }

  private async performDeleteUser(userId: string): Promise<void> {
    try {
      // Note: We don't have a delete user endpoint yet
      // In a real app, you'd call the user service delete method
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'User deletion not implemented - API limitation'
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete user'
      });
      console.error('Error deleting user:', error);
    }
  }

  // Filtering methods
  get filteredUsers(): UserInfo[] {
    let filtered = this.users;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    if (this.selectedRole !== null) {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = null;
  }

  // Utility methods
  getRoleLabel(role: Roles): string {
    switch (role) {
      case Roles.Student: return 'Student';
      case Roles.Instructor: return 'Instructor';
      case Roles.Admin: return 'Admin';
      case Roles.SuperAdmin: return 'Super Admin';
      default: return 'Unknown';
    }
  }

  getRoleColor(role: Roles): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    switch (role) {
      case Roles.Student: return 'info';
      case Roles.Instructor: return 'success';
      case Roles.Admin: return 'warn';
      case Roles.SuperAdmin: return 'danger';
      default: return 'secondary';
    }
  }

  getUserInitials(user: UserInfo): string {
    return user.name?.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase() || 'U';
  }

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

  getUserStatus(user: UserInfo): string {
    if (user.role === Roles.Admin) return 'Active';
    if (user.branchId && user.trackId) return 'Active';
    if (user.branchId || user.trackId) return 'Partially Assigned';
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
    this.loadUsers();
  }

  navigateBack(): void {
    this.router.navigate(['/admin']);
  }

  onCancel(): void {
    this.upgradeDialogVisible = false;
    this.upgradeForm.reset();
  }

  // Get tracks filtered by selected branch
  getTracksForBranch(branchId?: number): Track[] {
    if (!branchId) return [];
    return this.tracks.filter(track => track.branchId === branchId);
  }
} 