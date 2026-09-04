import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';
import { environment } from '../../environments/environment.development';

export interface ScheduleItem {
  courseCode: string;
  title: string;
  schedule: string;
  status: number; // 0 = Pending, 1 = Approved, 2 = Rejected
}
export interface StudentSchedule {
  studentId: number;
  courses: ScheduleItem[];
}

const url = `${environment.apiUrl}/enrollments`;

@Service()
export class EnrollmentService {
  private http = inject(HttpClient);

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(url);
  }

  enroll(courseCode: string, studentId: number): Observable<{ enrollmentId: number; studentId: number; courseCode: string }> {
    return this.http.post<any>(url, { courseCode, studentId });
  }

  getSchedule(studentId: number): Observable<StudentSchedule> {
    return this.http.get<StudentSchedule>(`${url}/${studentId}/schedule`);
  }

  approve(id: string): Observable<void> {
    return this.http.put<void>(`${url}/${id}/approve`, {});
  }
}
