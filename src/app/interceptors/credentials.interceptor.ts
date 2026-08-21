import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
    const accessToken = inject(AuthService).getAccessToken();
    const request = accessToken && !req.url.includes('/api/auth/')
        ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
        : req;
    return next(request);
};
