import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StudentService } from '../../../services/student';
import { CreateStudentRequest } from '../../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss',
})
export class StudentForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<StudentForm>);
  private studentService = inject(StudentService);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    registrationNumber: ['', [Validators.required, Validators.pattern(/^REG-\d{3,}$/i)]],
    gpa: [3.5, [Validators.required, Validators.min(0), Validators.max(4.0)]],
    isActived: [true],
  });

  autoGenerateRegNumber() {
    const randomNum = Math.floor(100 + Math.random() * 900);
    this.form.controls.registrationNumber.setValue(`REG-${randomNum}`);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload: CreateStudentRequest = this.form.getRawValue();

    this.studentService.create(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.dialogRef.close(true); // Close with success flag
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const detail = err.error?.detail ?? err.error?.title ?? 'Failed to register student. Please check input data.';
        this.errorMessage.set(detail);
      },
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
