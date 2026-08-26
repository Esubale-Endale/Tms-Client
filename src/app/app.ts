import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './ui/navbar/navbar';
import { EnrollmentStore } from './store/enrollment.store';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('Tms-Client');
  private store = inject(EnrollmentStore);
  private authService = inject(AuthService);

  ngOnInit() {
    if (this.authService.currentUser()) {
      this.store.loadEnrollments();
      this.store.listenForLiveUpdates();
    }
  }
}
