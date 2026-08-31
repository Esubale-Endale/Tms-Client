import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Course } from '../../../models/course.model';
import { AuthService } from '../../../services/auth';
import { CourseService } from '../../../services/course';
import { EnrollmentService } from '../../../services/enrollment';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.scss'],
})
export class StudentDashboardComponent {
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private authService = inject(AuthService);

  studentName = signal(this.authService.currentUser()?.displayName || 'Student');
  earnedCredits = signal(116);
  selectedCourse = signal<Course | null>(null);

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    this.enrollmentService.enroll(course.code).subscribe(() => {
      console.log('Enrollment requested for:', course.title);
      console.log(course);
    });
  }

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress',
  );

  coursesResource = rxResource({ stream: () => this.courseService.getAll() });

  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }
}
