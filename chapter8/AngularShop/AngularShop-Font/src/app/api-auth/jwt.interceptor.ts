import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "@envs/environment";
import { AuthenticationService }
  from "src/app/services/authentication.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService
  ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler)
    : Observable<HttpEvent<any>>  {
    //로그인 여부 확인
    const isLoggedIn = this.authService.isLoggedIn;
    //요청 하려는 Url이 api서버의 Url인지 확인
    const isApiUrl = req.url.startsWith(`${environment.baseUrl}api`);

    if(isLoggedIn && isApiUrl) {
      //api 서버에 보내는 요청이라면, JWT토큰이 담겨있는 쿠키를 전달
      req = req.clone({
        withCredentials: true
      });
    }

    return next.handle(req);
  }
}
