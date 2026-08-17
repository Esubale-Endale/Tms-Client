import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { CourseService } from '../services/course';
import { Course } from '../models/course.model';
import { removeEntity, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { catchError, EMPTY } from 'rxjs';

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withEntities<Course>(),
  withState({ error: '' }),
  withMethods((store, svc = inject(CourseService)) => ({
    deleteCourse(id: number) {
      // 1. Take snapshot of current entities BEFORE mutating local state
      const previousSnapshot = store.entities();
      // 2. Instant visual feedback — remove entity immediately from local UI
      patchState(store, removeEntity(id));
      // 3. Dispatch API call to backend server
      svc
        .delete(id)
        .pipe(
          catchError((err) => {
            // 4. Server rejected request — restore previous snapshot and set error message
            patchState(store, setAllEntities(previousSnapshot));
            patchState(store, {
              error: 'Cannot delete course: active student enrollmentsexist.',
            });
            return EMPTY;
          }),
        )
        .subscribe();
    },
  })),
);
