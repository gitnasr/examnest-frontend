import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exam-closed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div class="max-w-md w-full p-8 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-maroon-600/20 flex items-center justify-center">
            <i class="pi pi-clock text-3xl text-maroon-400"></i>
          </div>
          <h1 class="text-2xl font-bold text-white mb-4">Exam Submission Closed</h1>
          <p class="text-slate-400 mb-8">
            The submission period for this exam has ended. Please contact your instructor if you believe this is an error.
          </p>
          <a 
            routerLink="/student/dashboard"
            class="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <i class="pi pi-arrow-left mr-2"></i>
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  `
})
export class ExamClosedComponent {} 