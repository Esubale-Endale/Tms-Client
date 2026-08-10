import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr"
import { EnrollmentStatus } from '../models/enrollment.model';

export interface EnrollmentStatusEvent {
  id: number;
  status: EnrollmentStatus;
}

@Service()
export class LiveSync {
  private platformId = inject(PLATFORM_ID);
  private connection: HubConnection | null = null;
  private eventsSubject = new Subject<EnrollmentStatusEvent>();

  events$ = this.eventsSubject.asObservable();

  connectionState = signal<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  baseUrl = 'https://localhost:7003';

  connect() {
    if (this.connection) return;

    if (!isPlatformBrowser(this.platformId)) return;

    this.connection = new HubConnectionBuilder()
      .withUrl(this.baseUrl + '/hubs/tms')
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    this.connection.on(
      'ReceiveEnrollmentStatusUpdated',
      (enrollmentId: string, status: EnrollmentStatus) => {
        this.eventsSubject.next({ id: Number(enrollmentId), status });
      },
    );

    this.connection.onreconnecting(() => this.connectionState.set('reconnecting'));
    this.connection.onreconnected(() => this.connectionState.set('connected'));
    this.connection.onclose(() => this.connectionState.set('disconnected'));

    this.connection
      .start()
      .then(() => this.connectionState.set('connected'))
      .catch((err: Error) => console.error('SignalR connection error:', err));
  }
}
