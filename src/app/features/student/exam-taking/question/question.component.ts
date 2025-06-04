import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

interface Question {
  id: number;
  text: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  selectedAnswer: string | null;
}

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, FormsModule, RadioButtonModule],
  template: `
    <div class="space-y-4">
      <div class="mb-6">
        <p
          class="text-base leading-relaxed text-white sm:text-lg font-medium"
        >
          {{ question.text }}
        </p>
      </div>
      <div class="space-y-3">
        @for (option of question.options; track $index) {
        <div class="group relative">
          <label
            [for]="'question_' + question.id + '_option_' + option.id"
            class="flex items-start p-4 transition-all duration-300 border cursor-pointer rounded-xl hover:shadow-lg backdrop-blur-sm"
            [ngClass]="{
              'bg-gradient-to-r from-emerald-900/80 to-emerald-800/70 border-emerald-400 shadow-lg shadow-emerald-900/20 dark:from-emerald-900/50 dark:to-emerald-800/40 dark:border-emerald-500/60':
                question.selectedAnswer === option.id,
              'bg-slate-900/70 border-slate-600/60 hover:bg-slate-800/80 hover:border-orange-400/80 hover:shadow-lg hover:shadow-orange-900/20 dark:bg-slate-800/70 dark:border-slate-500/60 dark:hover:bg-slate-700/80 dark:hover:border-orange-500/80':
                question.selectedAnswer !== option.id
            }"
          >
            <div
              class="relative flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              <p-radioButton
                [name]="'question_' + question.id"
                [value]="option.id"
                [(ngModel)]="question.selectedAnswer"
                (ngModelChange)="onAnswerSelect($event)"
                [inputId]="'question_' + question.id + '_option_' + option.id"
                class="hidden"
              ></p-radioButton>
              <div
                class="w-5 h-5 border-2 rounded-full transition-all duration-300 flex items-center justify-center shadow-sm"
                [ngClass]="{
                  'border-emerald-400 bg-emerald-500 shadow-emerald-400/50 dark:shadow-emerald-500/30':
                    question.selectedAnswer === option.id,
                  'border-slate-400 bg-slate-700 dark:border-slate-400 dark:bg-slate-600 group-hover:border-orange-400 dark:group-hover:border-orange-400':
                    question.selectedAnswer !== option.id
                }"
              >
                @if (question.selectedAnswer === option.id) {
                <div class="w-2 h-2 bg-white rounded-full"></div>
                }
              </div>
            </div>
            <div class="flex-1 ml-4">
              <span
                class="text-sm font-semibold transition-colors sm:text-base"
                [ngClass]="{
                  'text-emerald-100 dark:text-emerald-100':
                    question.selectedAnswer === option.id,
                  'text-slate-200 dark:text-slate-200 group-hover:text-white dark:group-hover:text-white':
                    question.selectedAnswer !== option.id
                }"
              >
                {{ option.text }}
              </span>
            </div>
            @if (question.selectedAnswer === option.id) {
            <div class="flex-shrink-0 ml-3">
              <div
                class="flex items-center justify-center w-6 h-6 bg-emerald-500 rounded-full shadow-lg"
              >
                <svg
                  class="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            }
          </label>
        </div>
        }
      </div>
      @if (!question.options || question.options.length === 0) {
      <div
        class="p-6 text-center text-slate-300 dark:text-slate-300 bg-slate-800/80 dark:bg-slate-800/80 rounded-xl border border-slate-500/50 dark:border-slate-500/50 backdrop-blur-sm"
      >
        <p class="text-sm font-medium">
          No options available for this question.
        </p>
      </div>
      }
    </div>
  `,
 
})
export class QuestionComponent {
  @Input() question!: Question;
  @Output() answerSelected = new EventEmitter<{
    questionId: number;
    answerId: string;
  }>();

  onAnswerSelect(answerId: string): void {
    if (this.question) {
      this.question.selectedAnswer = answerId;
      this.answerSelected.emit({
        questionId: this.question.id,
        answerId: answerId,
      });
    }
  }

 
}
