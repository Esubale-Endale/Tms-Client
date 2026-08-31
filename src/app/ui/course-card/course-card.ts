import { Component, inject, input, output } from '@angular/core';
import { Course } from '../../models/course.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'tms-course-card',
  standalone: true,
  templateUrl: './course-card.html',
  styleUrls: ['./course-card.scss'],
  imports: [RouterLink],
})
export class CourseCardComponent {
  auth = inject(AuthService);
  course = input.required<Course>();
  enrollClicked = output<Course>();
  deleteCourse = output<number>();
}
