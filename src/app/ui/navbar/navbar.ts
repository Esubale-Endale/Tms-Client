import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [RouterLink, MatToolbarModule, MatButtonModule],
})
export class Navbar {
  protected authService = inject(AuthService);
  private router = inject(Router);

  async refreshSession(): Promise<void> {
    try {
      await this.authService.refresh();
    } catch {
      this.authService.logout();
      void this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
