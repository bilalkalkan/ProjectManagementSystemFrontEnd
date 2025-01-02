import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(`🌐 ${req.method} ${req.url}`);
    const startTime = Date.now();

    return next.handle(req).pipe(
      tap({
        next: () => {
          const endTime = Date.now();
          console.log(`✅ ${req.method} ${req.url} (${endTime - startTime}ms)`);
        },
        error: (error) => {
          const endTime = Date.now();
          console.error(
            `❌ ${req.method} ${req.url} (${endTime - startTime}ms)`,
            error
          );
        },
      })
    );
  }
}
