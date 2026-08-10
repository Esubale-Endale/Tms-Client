import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState } from '@ngrx/signals';
import { withEntities, setAllEntities, updateEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, EMPTY, switchMap } from 'rxjs';
import { EnrollmentService } from '../services/enrollment';
import { Enrollment, EnrollmentStatus } from '../models/enrollment.model';
import { LiveSync } from '../services/live-sync';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withEntities<Enrollment>(),
  withState({ isLoading: false, error: null as string | null }),

  withComputed((store) => ({
    pendingCount: computed(
      () => store.entities().filter((e) => e.status === EnrollmentStatus.Pending).length,
    ),
  })),

  withMethods((
    store,
    api = inject(EnrollmentService),
    sync = inject(LiveSync)
  ) => ({
    listenForLiveUpdates: rxMethod<void>(
      pipe(
        tap(() => sync.connect()),
        switchMap(() => sync.events$),
        tap(event => {
            const id = Number(event.id);

            const enrollment = store.entities().find((e) => e.id === id);

            if (!enrollment) {
              console.warn('Enrollment not found:', id);
              return;
            }
          patchState(
            store,
            updateEntity({id: event.id, changes: {status : event.status}})
          )
        })
      )
    ),

    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        concatMap(() =>
          api.getAll().pipe(
            tap((rows) => patchState(store, setAllEntities(rows), { isLoading: false })),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    approveEnrollment: rxMethod<string>(
      pipe(
        tap((id) => {
          patchState(store, updateEntity({ id, changes: { status: EnrollmentStatus.Approved } }));
        }),
        concatMap((id) =>
          api.approve(id).pipe(
            catchError((err) => {
              patchState(
                store,
                updateEntity({ id, changes: { status: EnrollmentStatus.Pending } }),
              );
              patchState(store, {
                error: 'Server rejected the approval.Check enrollment constraints.',
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),
  })),
);
