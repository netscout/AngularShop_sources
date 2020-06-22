import { Component, OnInit } from '@angular/core';
import { AuthenticationService }
  from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutPageComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private extAuthService: SocialAuthService,
  ) { }

  ngOnInit(): void {
    let provider = this.authService.currentUserValue.provider;

    this.authService.logout()
      .then(() => {
        //로그아웃 성공 후에 각 로그인 채널 별로 후처리
        switch (provider) {
          case "google":
            this.extAuthService.signOut();
            this.logout();
            break;
          case "kakao":
            this.authService.handleKakaoLogout()
              .then(() => {
                this.logout();
              })
              .catch(console.error)
          default:
            this.logout();
            break;
        }
      })
      .catch(error => console.error)
  }

  logout() {
    this.router.navigate(['/']);
  }
}
