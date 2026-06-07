import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api')) {
    const apiReq = req.clone({ url: `${API_URL}${req.url}` });
    return next(apiReq);
  }
  return next(req);
};
