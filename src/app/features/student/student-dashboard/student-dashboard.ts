import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { AuthService } from '../../../services/auth';
import { EnrollmentService } from '../../../services/enrollment';
import { StudentService } from '../../../services/student';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.scss'],
})
export class StudentDashboardComponent {
  private authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);

  currentUser = computed(() => this.authService.currentUser());
  studentName = computed(() => this.currentUser()?.displayName || 'Student');

  studentResource = rxResource({
    stream: () => {
      const name = this.currentUser()?.displayName;
      return name ? this.studentService.getByName(name) : of(undefined);
    },
  });

  studentId = computed(() => this.studentResource.value()?.id ?? 1);
  gpa = computed(() => this.studentResource.value()?.gpa ?? 0);
  registrationNumber = computed(() => this.studentResource.value()?.registrationNumber ?? 'N/A');

  scheduleResource = rxResource({
    stream: () => this.enrollmentService.getSchedule(this.studentId()),
  });

  courses = computed(() => this.scheduleResource.value()?.courses ?? []);
  totalEnrolled = computed(() => this.courses().length);
  approvedEnrollments = computed(() => this.courses().filter((c) => c.status === 1));
  pendingEnrollments = computed(() => this.courses().filter((c) => c.status === 0));

  earnedCredits = computed(() => this.approvedEnrollments().length * 3);
  graduationStatus = computed(() => (this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress'));
  creditProgress = computed(() => Math.min(100, Math.round((this.earnedCredits() / 120) * 100)));
  refreshSchedule() {
    this.scheduleResource.reload();
  }

  statusFeedback = signal<{ message: string; isError: boolean } | null>(null);
}
