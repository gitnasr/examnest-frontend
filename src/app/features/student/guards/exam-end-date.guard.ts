import { CanActivateFn, Router } from '@angular/router';
import { Observable, map } from 'rxjs';

import { ExamService } from '../services/exam.service';
import { inject } from '@angular/core';

export const examEndDateGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const examService = inject(ExamService);
  const examId = route.paramMap.get('examId');
  
  if (!examId) {
    return router.createUrlTree(['/student/dashboard']);
  }
  
  return examService.getExamData(examId).pipe(
    map(exam => {
      const now = new Date();
      if (now > exam.endTime) {
        return router.createUrlTree(['/student/closed']);
      }
      return true;
    })
  );
}; 