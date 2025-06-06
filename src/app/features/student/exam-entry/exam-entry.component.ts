import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-exam-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './exam-entry.component.html',
  styleUrl: './exam-entry.component.css',
})
export class ExamEntryComponent {
  /**
   *
   */
  constructor(private router: Router) {
    
    
    
  } 
  startExam() {
    if (this.examId.trim()) {
      this.isLoading = true;
      this.router.navigate(['/student/exam-taking', this.examId.trim()]);
    }
  }
  examId: string = '';
  isLoading: boolean = false;
}
