import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { environment } from "../../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // API isteklerine token ekle
    if (request.url.startsWith("http://localhost:5113/api")) {
      const currentUser = this.authService.currentUserValue;
      const token = currentUser?.token || this.authService.getToken();

      if (token) {
        // Isteğe Authorization header'i ekle
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error) => {
        console.log("Interceptor error:", error);

        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            // 401 Unauthorized hatası durumunda kullanıcıyı logout yap
            console.log("401 error detected, logging out");
            this.authService.logout();
            window.location.href = "/auth/login";
          } else if (error.status === 0) {
            // CORS veya network hatası
            console.error("CORS or Network error:", error);
            return throwError(
              () => new Error("Sunucuya bağlanılamadı. CORS veya ağ hatası.")
            );
          }
        }

        return throwError(() => error);
      })
    );
  }
}
