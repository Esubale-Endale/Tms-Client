import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [RouterLink, MatToolbarModule, MatButtonModule, TitleCasePipe],
})
export class Navbar {
  protected authService = inject(AuthService);
  private router = inject(Router);

  allowedRoles = ['Admin', 'Instructor', 'Student'];
  roleToLinkMap: Record<string, { label: string; route: string }[]> = {
    Admin: [
      { label: 'Dashboard', route: '/admin' },
      { label: 'Students', route: '/admin/students' },
      { label: 'Courses', route: '/admin/courses' },
    ],
    Instructor: [
      { label: 'Dashboard', route: '/instructor' },
      { label: 'Students', route: '/instructor/students' },
      { label: 'Courses', route: '/instructor/courses' },
      { label: 'Grade Submission', route: '/instructor/grade-submission' },
    ],
    Student: [
      { label: 'Dashboard', route: '/student' },
      { label: 'Enrollments', route: '/student/enrollments' },
      { label: 'Courses', route: '/student/courses' },
    ],
  };

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  checkUser(): void {
    const user = this.authService.profile();
    console.log('Current user:', user);
  }

  async profile(): Promise<void> {
    await this.authService.profile();
  }
}
