import { Component, inject } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment';

@Component({
  selector: 'app-schedule',
  imports: [],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule {
  private enlollmentService = inject(EnrollmentService);

  
}
