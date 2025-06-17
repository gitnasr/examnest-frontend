import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { BranchService } from '../../../shared/services/branch.service';
import { Branch, BranchDTO } from '../../../shared/interfaces/api.interface';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-branch-management',
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
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    BadgeModule,
    TooltipModule,
    NavBarComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './branch-management.component.html',
  styleUrls: ['./branch-management.component.css']
})
export class BranchManagementComponent implements OnInit {
  branches: Branch[] = [];
  selectedBranch: Branch | null = null;
  branchDialogVisible = false;
  
  isLoading = true;
  error: string | null = null;
  
  // Forms
  branchForm: FormGroup;
  
  // Pagination
  currentPage = 1;
  totalRecords = 0;
  rowsPerPage = 10;
  
  // Filtering
  searchTerm = '';

  constructor(
    private branchService: BranchService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.branchForm = this.formBuilder.group({
      branchName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadBranches();
  }

  private async loadBranches(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await this.branchService.getBranches(this.currentPage).toPromise();
      if (response) {
        // Map branchID to id if needed
        this.branches = response.map((branch: any) => ({
          ...branch,
          id: branch.id ?? branch.branchID
        }));
        this.totalRecords = this.branches.length;
      }
    } catch (error) {
      this.error = 'Failed to load branches';
      console.error('Error loading branches:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Branch Management
  openNewBranch(): void {
    this.selectedBranch = null;
    this.branchForm.reset();
    this.branchDialogVisible = true;
  }

  editBranch(branch: Branch): void {
    this.selectedBranch = branch;
    this.branchForm.patchValue({
      branchName: branch.branchName
    });
    this.branchDialogVisible = true;
  }

  async saveBranch(): Promise<void> {
    if (this.branchForm.invalid) {
      this.markFormGroupTouched(this.branchForm);
      return;
    }

    try {
      const branchData: BranchDTO = this.branchForm.value;
      
      if (this.selectedBranch) {
        // Update existing branch
        await this.branchService.updateBranch(this.selectedBranch.id, branchData).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Branch updated successfully'
        });
      } else {
        // Create new branch
        await this.branchService.createBranch(branchData).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Branch created successfully'
        });
      }
      
      this.branchDialogVisible = false;
      this.loadBranches();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save branch'
      });
      console.error('Error saving branch:', error);
    }
  }

  deleteBranch(branch: Branch): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the branch "${branch.branchName}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performDeleteBranch(branch.id);
      }
    });
  }

  private async performDeleteBranch(branchId: number): Promise<void> {
    try {
      await this.branchService.deleteBranch(branchId).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Branch deleted successfully'
      });
      this.loadBranches();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete branch'
      });
      console.error('Error deleting branch:', error);
    }
  }

  // Filtering methods
  get filteredBranches(): Branch[] {
    let filtered = this.branches;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(branch => 
        branch.branchName.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
  }

  // Utility methods
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.loadBranches();
  }

  navigateBack(): void {
    this.router.navigate(['/admin']);
  }

  onCancel(): void {
    this.branchDialogVisible = false;
    this.branchForm.reset();
  }
} 