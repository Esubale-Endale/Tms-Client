import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateStudentRequest, Student } from '../models/student.model';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

const url = `${environment.apiUrl}/students`;

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(url);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${url}/${id}`);
  }

  getByName(name: string): Observable<Student | undefined> {
    return this.getAll().pipe(map((students) => students.find((s) => s.name.toLowerCase() === name.toLowerCase())));
  }

  create(student: CreateStudentRequest): Observable<void> {
    return this.http.post<void>(url, student);
  }
}
