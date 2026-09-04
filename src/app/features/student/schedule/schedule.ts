import { Component, inject } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-schedule',
  imports: [],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule {
  private enlollmentService = inject(EnrollmentService);
  private authService = inject(AuthService);

  schedules = () => {
    const Myschedules = this.enlollmentService.getSchedule(3);

    console.log('schedules', Myschedules);
    return Myschedules;
  };
}
