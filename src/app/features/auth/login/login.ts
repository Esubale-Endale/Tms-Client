import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = signal('');
  password = signal('!234QWERasdf');

  loading = signal(false);
  error = signal('');

  async login() {
    this.loading.set(true);
    this.error.set('');

    try {
      await this.authService.login({
        email: this.username(),
        password: this.password(),
      });

      this.authService.currentUser()?.role === 'Student'
        ? await this.router.navigate(['/student'])
        : this.authService.currentUser()?.role === 'Admin'
          ? await this.router.navigate(['/admin'])
          : this.authService.currentUser()?.role === 'Instructor'
            ? await this.router.navigate(['/instructor'])
            : console.log(this.authService.currentUser()?.role);
    } catch (error) {
      this.error.set(this.authService.getErrorMessage(error, 'Invalid email or password.'));
    } finally {
      this.loading.set(false);
    }
  }
}
