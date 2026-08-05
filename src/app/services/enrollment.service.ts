import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Service()
export class EnrollmentService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7003/api/v1/enrollments?courseId=1';
  private baseUrlV2 = 'https://localhost:7003/api/v2/enrollments';

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.baseUrl);
  }

  enroll(courseId: string): Observable<void> {
    return this.http.post<void>(this.baseUrlV2, { courseCode: courseId, studentId: 3 });
  }

  approve(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrlV2}/${id}/approve`, {});
  }
}
