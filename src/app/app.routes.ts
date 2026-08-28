import { Routes } from '@angular/router';

const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
];
const studentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/students/student-dashboard/student-dashboard').then((m) => m.StudentDashboardComponent),
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
    loadComponent: () => import('./features/instructor/student-list/student-list').then((m) => m.StudentList),
  },
  {
    path: 'grade-submission',
    loadComponent: () => import('./features/grade-submission/grade-submission').then((m) => m.GradeSubmission),
  },
];
const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/admin/admin-course-list/admin-course-list').then((m) => m.AdminCourseList),
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./features/courses/course-detail/course-detail').then((m) => m.CourseDetail),
  },
  {
    path: 'students',
    loadComponent: () => import('./features/instructor/student-list/student-list').then((m) => m.StudentList),
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
    children: studentRoutes,
  },
  // Instructor routes
  {
    path: 'instructor',
    loadComponent: () => import('./layouts/instructor-layout/instructor-layout').then((m) => m.InstructorLayout),
    children: instructorRoutes,
  },
  // Admin routes
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: adminRoutes,
  },
];
