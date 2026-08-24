import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';
import { AdminCourseList } from './features/admin/admin-course-list/admin-course-list';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/students/student-dashboard/student-dashboard').then(
        (m) => m.StudentDashboardComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
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
      import('./features/instructor/instructor-dashboard/instructor-dashboard').then(
        (m) => m.InstructorDashboard,
      ),
  },
  {
    path: 'grade-submission',
    loadComponent: () =>
      import('./features/grade-submission/grade-submission').then((m) => m.GradeSubmission),
  },
  {
    path: 'admin/courses',
    component: AdminCourseList,
    canActivate: [roleGuard('Admin')],
  },
];
