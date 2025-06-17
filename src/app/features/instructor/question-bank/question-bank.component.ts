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
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { QuestionBankService } from '../../../shared/services/question-bank.service';
import { CourseService } from '../../../shared/services/course.service';
import { QuestionBank, Choice, Course, QuestionBankCreatePayload, ChoiceCreatePayload } from '../../../shared/interfaces/api.interface';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-question-bank',
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
    InputNumberModule,
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    BadgeModule,
    TooltipModule,
    NavBarComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.css']
})
export class QuestionBankComponent implements OnInit {
  questions: QuestionBank[] = [];
  courses: Course[] = [];
  selectedQuestion: QuestionBank | null = null;
  questionDialogVisible = false;
  choiceDialogVisible = false;
  selectedChoices: Choice[] = [];
  
  isLoading = true;
  error: string | null = null;
  
  // Forms
  questionForm: FormGroup;
  choiceForm: FormGroup;
  
  // Pagination
  currentPage = 1;
  totalRecords = 0;
  rowsPerPage = 10;
  
  // Question types
  questionTypes = [
    { label: 'Multiple Choice', value: 'MCQ' },
    { label: 'True/False', value: 'TF' },
    { label: 'Essay', value: 'ESSAY' }
  ];

  constructor(
    private questionBankService: QuestionBankService,
    private courseService: CourseService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.questionForm = this.formBuilder.group({
      courseId: ['', Validators.required],
      questionText: ['', Validators.required],
      questionType: ['MCQ', Validators.required],
      modelAnswer: ['', Validators.required],
      points: [1, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    this.choiceForm = this.formBuilder.group({
      questionId: ['', Validators.required],
      choiceLetter: ['', Validators.required],
      choiceText: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadQuestions();
    this.loadCourses();
  }

  private async loadQuestions(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await this.questionBankService.getQuestions(this.currentPage).toPromise();
      if (response) {
        this.questions = response;
        this.totalRecords = response.length; // In a real app, this would come from pagination metadata
      }
    } catch (error) {
      this.error = 'Failed to load questions';
      console.error('Error loading questions:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadCourses(): Promise<void> {
    try {
      const response = await this.courseService.getCourses(1).toPromise();
      if (response) {
        // Map courseID to id if needed
        this.courses = response.map((course: any) => ({
          ...course,
          id: course.id ?? course.courseID
        }));
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  // Question Management
  openNewQuestion(): void {
    this.selectedQuestion = null;
    this.questionForm.reset({
      questionType: 'MCQ',
      points: 1
    });
    this.questionDialogVisible = true;
  }

  editQuestion(question: QuestionBank): void {
    this.selectedQuestion = question;
    this.questionForm.patchValue({
      courseId: question.courseId,
      questionText: question.questionText,
      questionType: question.questionType,
      modelAnswer: question.modelAnswer,
      points: question.points
    });
    this.questionDialogVisible = true;
  }

  async saveQuestion(): Promise<void> {
    if (this.questionForm.invalid) {
      this.markFormGroupTouched(this.questionForm);
      return;
    }

    try {
      const questionData: QuestionBankCreatePayload = this.questionForm.value;
      
      if (this.selectedQuestion) {
        // Update existing question
        await this.questionBankService.updateQuestion(this.selectedQuestion.questionId, questionData).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Question updated successfully'
        });
      } else {
        // Create new question
        await this.questionBankService.createQuestion(questionData).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Question created successfully'
        });
      }
      
      this.questionDialogVisible = false;
      this.loadQuestions();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save question'
      });
      console.error('Error saving question:', error);
    }
  }

  deleteQuestion(question: QuestionBank): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the question "${question.questionText.substring(0, 50)}..."?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performDeleteQuestion(question.questionId);
      }
    });
  }

  private async performDeleteQuestion(questionId: number): Promise<void> {
    try {
      await this.questionBankService.deleteQuestion(questionId).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Question deleted successfully'
      });
      this.loadQuestions();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete question'
      });
      console.error('Error deleting question:', error);
    }
  }

  // Choice Management
  openChoiceDialog(question: QuestionBank): void {
    this.selectedQuestion = question;
    this.choiceForm.patchValue({
      questionId: question.questionId
    });
    this.loadQuestionChoices(question.questionId);
    this.choiceDialogVisible = true;
  }

  private async loadQuestionChoices(questionId: number): Promise<void> {
    try {
      const response = await this.questionBankService.getQuestionChoices(questionId).toPromise();
      if (response) {
        this.selectedChoices = response;
      }
    } catch (error) {
      console.error('Error loading question choices:', error);
    }
  }

  async saveChoice(): Promise<void> {
    if (this.choiceForm.invalid) {
      this.markFormGroupTouched(this.choiceForm);
      return;
    }

    try {
      const choiceData: ChoiceCreatePayload = this.choiceForm.value;
      await this.questionBankService.createChoice(choiceData).toPromise();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Choice added successfully'
      });
      
      this.choiceForm.reset({
        questionId: this.selectedQuestion?.questionId
      });
      this.loadQuestionChoices(this.selectedQuestion!.questionId);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add choice'
      });
      console.error('Error saving choice:', error);
    }
  }

  deleteChoice(choice: Choice): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the choice "${choice.choiceText}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performDeleteChoice(choice);
      }
    });
  }

  private async performDeleteChoice(choice: Choice): Promise<void> {
    try {
      // Note: We need the choice ID for deletion, but the API might not return it
      // This is a limitation of the current API structure
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Choice deletion not implemented - API limitation'
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete choice'
      });
      console.error('Error deleting choice:', error);
    }
  }

  // Utility methods
  getCourseName(courseId: number): string {
    const course = this.courses.find(c => c.courseID === courseId);
    return course?.courseName || 'Unknown Course';
  }

  getQuestionTypeLabel(type: string): string {
    const questionType = this.questionTypes.find(qt => qt.value === type);
    return questionType?.label || type;
  }

  getQuestionTypeColor(type: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    switch (type) {
      case 'MCQ': return 'success';
      case 'TF': return 'warn';
      case 'ESSAY': return 'info';
      default: return 'secondary';
    }
  }

  truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.loadQuestions();
  }

  navigateBack(): void {
    this.router.navigate(['/instructor']);
  }
} 