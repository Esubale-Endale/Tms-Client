import { Component, effect, inject } from '@angular/core';
import { CourseService } from '../../../services/course';
import { Course } from '../../../models/course.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-admin-course-list',
  imports: [MatTableModule,  ],
  templateUrl: './admin-course-list.html',
  styleUrl: './admin-course-list.scss',
})
export class AdminCourseList {
  private courseService = inject(CourseService);
  displayedColumns: string[] = ['code', 'title', 'maxCapacity', 'enrollmentCount', 'status'];

  dataSource = new MatTableDataSource<Course>();

  constructor() {
    this.courseService.getAll().subscribe((courses: Course[]) => {
      this.dataSource.data = courses;
    });

    effect(() =>{
      console.log('Courses:', this.dataSource.data);
    })
  }
}
