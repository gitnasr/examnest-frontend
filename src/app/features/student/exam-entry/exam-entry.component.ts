import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
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
  ],
  templateUrl: './exam-entry.component.html',
  styleUrl: './exam-entry.component.css',
})
export class ExamEntryComponent {
  examId: string = '';
  isLoading: boolean = false;
  constructor() {}
}
