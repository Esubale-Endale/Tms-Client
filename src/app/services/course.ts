import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Course, CourseDetail, PagedResponse } from '../models/course.model';
import { environment } from '../../environments/environment.development';

@Service()
export class CourseService {
  private http = inject(HttpClient);
  private readonly base = `${environment.baseUlr}${environment.apiUrl}/courses`;

  getAll(page = 1, pageSize = 12) {
    return this.http
      .get<PagedResponse<Course>>(this.base, {
        params: { page: page.toString(), pageSize: pageSize.toString() },
      })
      .pipe(map((p) => p.items));
  }
  getById(id: string) {
    return this.http.get<CourseDetail>(`${this.base}/${id}`);
  }
  delete(id: number) {
    return this.http.delete<CourseDetail>(`${this.base}/${id}`);
  }
}
