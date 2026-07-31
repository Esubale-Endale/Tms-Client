import { rxResource } from '@angular/core/rxjs-interop';
import { CourseService } from '../../services/course';
import { Component, signal, computed, inject } from '@angular/core';
import { CourseCardComponent } from '../../ui/course-card/course-card';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CourseCardComponent],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboardComponent {
  private api = inject(CourseService);

  studentName = signal('Liya Kebede');
  earnedCredits = signal(116);
  selectedCourse = signal<Course | null>(null);

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log('Enrollment requested for:', course.title);
    console.log(course)
  }

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress',
  );

  coursesResource = rxResource({ stream: () => this.api.getAll() });

  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }
}
