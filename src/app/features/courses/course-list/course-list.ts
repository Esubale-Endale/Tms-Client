import { Component, inject, signal } from '@angular/core';
import { CourseService } from '../../../services/course';
import { rxResource } from '@angular/core/rxjs-interop';
import { A11yModule } from '@angular/cdk/a11y';
import { CourseCardComponent } from '../../../ui/course-card/course-card';
import { Course } from '../../../models/course.model';
import { EnrollmentService } from '../../../services/enrollment';

@Component({
  selector: 'app-course-list',
  imports: [A11yModule, CourseCardComponent],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList {
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);


  selectedCourse = signal<Course | null>(null);

  courses = rxResource({ stream: () => this.courseService.getAll(1, 12) });

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    this.enrollmentService.enroll(course.code,3 ).subscribe(() => {});
  }
}
