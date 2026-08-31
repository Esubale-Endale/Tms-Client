import { Component, effect, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StudentService } from '../../../services/student';
import { Student } from '../../../models/student.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { StudentForm } from '../student-form/student-form';

@Component({
  selector: 'app-student-list',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss',
})
export class StudentList {
  private dialog = inject(MatDialog);
  studentService = inject(StudentService);
  displayedColumns: string[] = ['registrationNumber', 'name', 'gpa', 'isActive', 'enrollmentCount'];

  dataSource = new MatTableDataSource<Student>();

  constructor() {
    this.studentService.getAll().subscribe((students: Student[]) => {
      this.dataSource.data = students;
    });

    effect(() => {
      console.log('Students at student-list:', this.dataSource.data);
    });
  }

  onRegisterStudent() {
    console.log('Register Student button clicked');
  }

  openRegisterDialog() {
    const dialogRef = this.dialog.open(StudentForm, {
      width: '500px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('New student registered:', result);
        // this.studentService.create(result).subscribe((student: Student) => {
        //   this.dataSource.data = [...this.dataSource.data, student];
        // });
      }
    });
  }
}
