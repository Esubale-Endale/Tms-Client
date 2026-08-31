import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';
import { environment } from '../../environments/environment.development';

const url = `${environment.baseUrl}${environment.apiUrlv2}/enrollments`;
@Service()
export class EnrollmentService {
  private http = inject(HttpClient);

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(url);
  }

  enroll(courseId: string): Observable<void> {
    return this.http.post<void>(url, {
      courseCode: courseId,
      studentId: 3,
    });
  }

  approve(id: string): Observable<void> {
    return this.http.put<void>(`${url}s/${id}/approve`, {});
  }
}
