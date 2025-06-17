import { Routes } from '@angular/router';

export const INSTRUCTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./instructor-dashboard/instructor-dashboard.component').then(
        (m) => m.InstructorDashboardComponent
      ),
  },
  {
    path: 'exam-management',
    loadComponent: () =>
      import('./exam-management/exam-management.component').then(
        (m) => m.ExamManagementComponent
      ),
  },
  {
    path: 'question-bank',
    loadComponent: () =>
      import('./question-bank/question-bank.component').then(
        (m) => m.QuestionBankComponent
      ),
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./students/students.component').then(
        (m) => m.StudentsComponent
      ),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./courses/courses.component').then(
        (m) => m.CoursesComponent
      ),
  },
]; 