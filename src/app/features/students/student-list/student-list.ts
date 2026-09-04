import { Component, effect, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StudentService } from '../../../services/student';
import { Student } from '../../../models/student.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { StudentForm } from '../student-form/student-form';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-student-list',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss',
})
export class StudentList {
  private dialog = inject(MatDialog);
  studentService = inject(StudentService);
  authService = inject(AuthService);
  displayedColumns: string[] = ['registrationNumber', 'name', 'gpa', 'isActive', 'enrollmentCount'];

  dataSource = new MatTableDataSource<Student>();

  constructor() {
    this.studentService.getAll().subscribe((students: Student[]) => {
      this.dataSource.data = students;
    });

    effect(() => {
      console.log('Students at student-list:', this.dataSource.data.values());
    });
  }

  loadStudents() {
    this.studentService.getAll().subscribe((students: Student[]) => {
      this.dataSource.data = students;
    });
  }

  openRegisterDialog() {
    const dialogRef = this.dialog.open(StudentForm, {
      width: '480px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) {
        this.loadStudents();
      }
    });
  }
}
