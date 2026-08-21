import { Component, inject } from '@angular/core';
import { CourseService } from '../../../services/course';

@Component({
  selector: 'app-admin-course-list',
  imports: [],
  templateUrl: './admin-course-list.html',
  styleUrl: './admin-course-list.scss',
})
export class AdminCourseList {
 private api = inject(CourseService);
}
