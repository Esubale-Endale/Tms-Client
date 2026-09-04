import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Course, CourseDetail, PagedResponse } from '../models/course.model';
import { environment } from '../../environments/environment.development';

const url = `${environment.apiUrl}/courses`;
@Service()
export class CourseService {
  private http = inject(HttpClient);

  getAll(page = 1, pageSize = 12) {
    return this.http
      .get<PagedResponse<Course>>(url, {
        params: { page: page.toString(), pageSize: pageSize.toString() },
      })
      .pipe(map((p) => p.data ?? p.items ?? []));
  }
  getById(id: string) {
    return this.http.get<CourseDetail>(`${url}/${id}`);
  }
  delete(id: number) {
    return this.http.delete<CourseDetail>(`${url}/${id}`);
  }
}
