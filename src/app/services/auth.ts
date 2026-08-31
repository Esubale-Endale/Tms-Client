import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';

interface ProfileResponse {
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
}
export interface TmsUser {
  userId: string;
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

const apiUrl = environment.baseUrl + environment.apiUrlv2 + '/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private accessToken = signal<string | null>(null);
  private readonly refreshTokenKey = 'tms.refresh-token';
  private refreshToken = signal<string | null>(sessionStorage.getItem(this.refreshTokenKey));
  currentUser = signal<TmsUser | null>(null);

  //roleCheck
  isAdmin = computed(() => this.currentUser()?.role === 'Admin');
  isStudent = computed(() => this.currentUser()?.role === 'Student');
  isInstructor = computed(() => this.currentUser()?.role === 'Instructor');

  getAccessToken(): string | null {
    return this.accessToken();
  }

  async register(request: RegisterRequest): Promise<void> {
    await firstValueFrom(this.http.post(apiUrl + '/auth/register', request));
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin';
  }

  async login(credentials: LoginRequest): Promise<void> {
    const res = await firstValueFrom(this.http.post<AuthResponse>(apiUrl + '/login', credentials));
    this.storeTokens(res);
    this.setUserFromToken(res.accessToken);
  }

  async refresh(): Promise<void> {
    const refreshToken = this.refreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token is available.');
    }

    const tokens = await firstValueFrom(this.http.post<AuthResponse>(apiUrl + '/refresh', { refreshToken }));
    this.storeTokens(tokens);
    this.setUserFromToken(tokens.accessToken);
  }

  async profile(): Promise<void> {
    const user = await firstValueFrom(this.http.get<ProfileResponse>(apiUrl + '/me'));

    if (user) {
      this.currentUser.set({ ...user, role: this.currentUser()?.role ?? '', displayName: user.firstName });
    }
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
      return error.error?.detail ?? 'Account locked after too many failed attempts. Try again later.';
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

  private setUserFromToken(token: string): void {
    const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, string | string[]>;
    const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    this.currentUser.set({
      userId: String(payload['sub']),
      displayName: String(payload['FirstName']) || String(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? ''),
      email: String(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? payload['email'] ?? ''),
      role: String(roles) ?? '',
    });
  }

  async restoreSession(): Promise<void> {
    try {
      await this.refresh();
      await this.profile();
    } catch {
      this.accessToken.set(null);
      this.currentUser.set(null);
      sessionStorage.removeItem(this.refreshTokenKey);
    }
  }
}
