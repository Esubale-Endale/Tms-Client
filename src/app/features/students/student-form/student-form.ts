import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-student-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss',
})
export class StudentForm {
  readonly studentName = signal('');
  readonly registrationNumber = signal('');

  constructor(private dialogRef: MatDialogRef<StudentForm>) {}

  close() {}
  save() {}
}
