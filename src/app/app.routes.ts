import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/student-dashboard/student-dashboard').then(
        (m) => m.StudentDashboardComponent,
      ),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/courses/course-detail/course-detail').then((m) => m.CourseDetail),
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./features/students/student-list/student-list').then((m) => m.StudentList),
  },
  {
    path: 'enrollments',
    loadComponent: () =>
      import('./features/enrollments/enrollment-list/enrollment-list').then(
        (m) => m.EnrollmentListComponent,
      ),
  },
  {
    path: 'instructor-dashboard',
    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard').then(
        (m) => m.InstructorDashboard,
      ),
  },
  {
    path: 'grade-submission',
    loadComponent: () =>
      import('./features/grade-submission/grade-submission').then((m) => m.GradeSubmission),
  },
];
