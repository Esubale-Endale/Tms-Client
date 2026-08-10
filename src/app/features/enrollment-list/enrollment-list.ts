import { Component, viewChild, effect, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment, EnrollmentStatus } from '../../models/enrollment.model';
@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './enrollment-list.html',
  styleUrls: ['./enrollment-list.scss'],
})
export class EnrollmentListComponent {
  EnrollmentStatus = EnrollmentStatus;
  store = inject(EnrollmentStore);
  displayedColumns = ['studentId', 'courseId', 'status', 'actions'];

  dataSource = new MatTableDataSource<Enrollment>();

  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);
  constructor() {
    this.store.loadEnrollments();
    effect(() => {
      this.dataSource.data = this.store.entities();
      console.log('Enrollments:', this.dataSource.data);
    });
    effect(() => {
      this.dataSource.paginator = this.paginator();
      this.dataSource.sort = this.sort();
    });
  }
  onApprove(id: string) {
    console.log(id);
  }
}
