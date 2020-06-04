import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthenticationService }
  from "src/app/services/authentication.service";
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler)
    : Observable<HttpEvent<any>>  {
    return next.handle(req)
      .pipe(catchError(err => {
        //인증되지 않은 상태 라면,
        if(err.status === 401) {
          this.authService.logout();
          location.reload(true);
        }
        //권한이 없는 페이지에 접근할 때(ex: 일반 유저가 관리자 페이지에)
        else if(err.status == 403) {
          this.router.navigate(['/']);
        }

        const error = err.error?.message || err.statusText;
        return throwError(error);
      }));
  }
}
