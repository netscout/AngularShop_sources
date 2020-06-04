import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot,
  RouterStateSnapshot } from "@angular/router";

import { AuthenticationService }
  from "src/app/services/authentication.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      const isLoggedIn = this.authService.isLoggedIn;

      //로그인 되어 있는 상태라면 접근 허용
      if(isLoggedIn) {
        //추가로 역할이 필요한 접근이라면
        if(route.data.roles) {
          const currentUser = this.authService.currentUserValue;

          //요구되는 역할과 일치하는 역할이 있는지 확인
          let hasRoles =
            currentUser.roles.filter(
              r => route.data.roles.includes(r.toUpperCase()));

          return hasRoles.length > 0;
        }

        return true;
      }

      //로그인 되어 있지 않다면 로그인 페이지로 이동
      //접근하려뎐 페이지는 returnUrl로 전달
      this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl: state.url
          }
        });
      return false;
  }
}
