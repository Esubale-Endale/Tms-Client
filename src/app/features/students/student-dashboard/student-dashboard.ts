import { rxResource } from '@angular/core/rxjs-interop';
import { CourseService } from '../../../services/course';
import { Component, signal, computed, inject } from '@angular/core';
import { CourseCardComponent } from '../../../ui/course-card/course-card';
import { Course } from '../../../models/course.model';
import { EnrollmentService } from '../../../services/enrollment';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CourseCardComponent],
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
