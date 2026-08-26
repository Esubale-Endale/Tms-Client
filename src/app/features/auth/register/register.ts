import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = signal<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'Admin',
  });
  loading = signal(false);
  error = signal('');
  success = signal('');

  update(field: keyof RegisterRequest, value: string): void {
    this.form.update((current) => ({ ...current, [field]: value }));
  }

  async register(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    try {
      await this.authService.register(this.form());
      this.success.set('Registration successful. Redirecting to sign in...');
      await this.router.navigate(['/login']);
    } catch (error) {
      this.error.set(this.authService.getErrorMessage(error, 'Registration could not be completed.'));
    } finally {
      this.loading.set(false);
    }
  }
}
