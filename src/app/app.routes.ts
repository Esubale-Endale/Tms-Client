import { Routes } from '@angular/router';
import { guestGuard, roleGuard } from './guards/role.guard';

const authRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
    canActivate: [guestGuard],
  },
];
const studentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/student/student-dashboard/student-dashboard').then((m) => m.StudentDashboardComponent),
  },
  {
    path: 'enrollments',
    loadComponent: () => import('./features/student/schedule/schedule').then((m) => m.Schedule),
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/courses/course-list/course-list').then((m) => m.CourseList),
    pathMatch: 'full',
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./features/courses/course-detail/course-detail').then((m) => m.CourseDetail),
  },
];
const instructorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/instructor/instructor-dashboard/instructor-dashboard').then((m) => m.InstructorDashboard),
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/courses/course-list/course-list').then((m) => m.CourseList),
  },
  {
    path: 'students',
    loadComponent: () => import('./features/students/student-list/student-list').then((m) => m.StudentList),
  },
  {
    path: 'grade-submission',
    loadComponent: () => import('./features/courses/grade-submission/grade-submission').then((m) => m.GradeSubmission),
  },
];
const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/courses/course-list/course-list').then((m) => m.CourseList),
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./features/courses/course-detail/course-detail').then((m) => m.CourseDetail),
  },
  {
    path: 'students',
    loadComponent: () => import('./features/students/student-list/student-list').then((m) => m.StudentList),
  },
  {
    path: 'enrollments',
    loadComponent: () => import('./features/enrollments/enrollment-list/enrollment-list').then((m) => m.EnrollmentListComponent),
  },
];

export const routes: Routes = [
  ...authRoutes,
  // Student routes
  {
    path: 'student',
    loadComponent: () => import('./layouts/student-layout/student-layout').then((m) => m.StudentLayout),
    canActivate: [roleGuard('Student')],
    children: studentRoutes,
  },
  // Instructor routes
  {
    path: 'instructor',
    loadComponent: () => import('./layouts/instructor-layout/instructor-layout').then((m) => m.InstructorLayout),
    canActivate: [roleGuard('Instructor')],
    children: instructorRoutes,
  },
  // Admin routes
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [roleGuard('Admin')],
    children: adminRoutes,
  },
];
