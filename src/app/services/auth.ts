import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface TmsUser {
  displayName: string;
  email: string;
  role: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
  role: string;
}
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private accessToken = signal<string | null>(null);
  private readonly refreshTokenKey = 'tms.refresh-token';
  currentUser = signal<TmsUser | null>(null);

  getAccessToken(): string | null {
    return this.accessToken();
  }

  async register(request: RegisterRequest): Promise<void> {
    await firstValueFrom(this.http.post('/api/auth/register', request));
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin';
  }

  async login(credentials: LoginRequest): Promise<void> {
    const res = await firstValueFrom(this.http.post<AuthResponse>('/api/auth/login', credentials));
    this.accessToken.set(res.accessToken);
    // Decode user payload from JWT (or fetch /api/auth/me)
    const payload = JSON.parse(atob(res.accessToken.split('.')[1]));
    this.currentUser.set({
      email: payload.email || payload.sub,
      displayName: payload.name || payload.email || 'User',
      role:
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        payload.role ||
        'Student',
    });
  }

  async refresh(): Promise<void> {
    const refreshToken = sessionStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) {
      throw new Error('No refresh token is available.');
    }
    const tokens = await firstValueFrom(
      this.http.post<AuthResponse>('/api/auth/refresh', { refreshToken }),
    );
    this.storeTokens(tokens);
    this.currentUser.set(this.userFromToken(tokens.accessToken));
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
  }

  getErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }
    if (error.status === 423) {
      return (
        error.error?.detail ?? 'Account locked after too many failed attempts. Try again later.'
      );
    }
    if (Array.isArray(error.error?.errors)) {
      return error.error.errors.join(' ');
    }
    return error.error?.detail ?? fallback;
  }

  private storeTokens(tokens: AuthResponse): void {
    this.accessToken.set(tokens.accessToken);
    sessionStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
  }

  private userFromToken(token: string): TmsUser {
    const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, string | string[]>;
    const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return {
      displayName: String(
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
          payload['sub'] ??
          '',
      ),
      email: String(
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
          payload['email'] ??
          '',
      ),
      role: String(roles[0]) ?? '',
    };
  }
}
