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
  password = signal('');

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

      await this.router.navigate(['/dashboard']);
    } catch (error) {
      this.error.set(this.authService.getErrorMessage(error, 'Invalid email or password.'));
    } finally {
      this.loading.set(false);
    }
  }
}
