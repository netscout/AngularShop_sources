import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseFormComponent } from 'src/app/base.form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService }
  from 'src/app/services/authentication.service';
import { CommonService } from 'src/app/services/common.service';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginPageComponent
extends BaseFormComponent
  implements OnInit, OnDestroy {
  loading = false;
  returnUrl: string;
  error = '';
  onLogin = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private commService: CommonService,
    private extAuthService: SocialAuthService
  ) {
    super();

    //returnUrl을 설정, 빈 값인 경우 루트로 설정
    this.returnUrl = this.route.snapshot.queryParams['returnUrl']
      || '/';

    //이미 로그인 되어 있다면 returnUrl로 전송
    if(this.authService.isLoggedIn) {
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit(): void {
    this.commService.loadCss(
      "styles/contact.css",
      () => {
        this.commService.loadCss(
          "styles/contact_responsive.css",
          () => {
            this.commService.loadScript(
              "js/login.js",
              () => {

              });
          });
      });

    this.initForm();

    this.initSocialLogin();
  }

  initSocialLogin() {
    //구글 로그인 설정
    this.extAuthService.authState.subscribe((user) => {
      //혹시 로그인 정보가 남아있더라도 로그인 시도가 아니면 무시
      if(this.onLogin && user) {
        this.loading = true;

        //로그인 성공 이후 처리할 작업들...!
        this.authService.login(user, "google")
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate([this.returnUrl]);
            },
            error => {
              this.error = error;
            }
          )
          .add(() => {
            this.loading = false;
          })
      }
    });

    //카카오 로그인 설정
    this.authService.initKakaoLogin()
      .then(result => {
        this.loading = true;

        //카카오 로그인 성공 후 받은 회원 정보 가져오기
        let providerKey = result["res"]["id"].toString();
        let expires = result["expires"];
        let name =
          result["res"]["kakao_account"]["profile"]["nickname"];
        let photoUrl =
          result["res"]["kakao_account"]["profile"]["thumbnail_image_url"];

        //여기서 "kakao", providerKey로 로그인이 등록되었는지 확인 부터.
        this.authService.checkSocialLogin(
          "kakao",
          providerKey)
          .subscribe(result => {
            //이미 이메일을 등록한 사용자라면,
            if(result.exist) {
              //바로 로그인처리
              let user = {
                email: "",
                providerKey: providerKey,
                name: name,
                photoUrl: photoUrl,
                expires: expires,
                provider: "kakao"
              };

              this.authService.login(user, "kakao")
                .pipe(first())
                .subscribe(
                  data => {
                    this.router.navigate([this.returnUrl]);
                  },
                  error => {
                    this.error = error;
                  }
                );
            }
            else {
              //이메일 등록으로 이동
              //이메일 등록 폼에 전달할 사용자 데이터
              let kakaoLoginInfo = {
                expires: expires,
                providerKey: providerKey,
                name: name,
                photoUrl: photoUrl,
                returnUrl: this.returnUrl
              };

              //로컬 스토리지에 저장하고 이메일 등록으로 이동
              localStorage.setItem('kakao', JSON.stringify(kakaoLoginInfo));
              this.router.navigate(['/register', 'kakao'])
            }
          },
          error => this.error = error)
          .add(() => {
            this.loading = false;
          });
      })
      .catch(err => this.error = err);
  }

  initForm() {
    //로그인 폼과 각 필드의 제약 조건을 설정
    this.form = this.formBuilder
    .group({
      email: ['',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[#$^+=!*()@%&]).{8,}$')
        ]
      ]
    });
  }

  onSubmit() {
    this.loading = true;

    let email = this.getValue("email");
    let password = this.getValue("password");
    this.authService.login({ email, password })
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = "이메일 또는 패스워드가 맞지 않습니다.";
        }
      )
      .add(() => {
        this.loading = false;
      });
  }

  //구글 로그인 버튼 클릭시
  signInWithGoogle(): void {
    this.onLogin = true;
    this.extAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnDestroy() {
    this.commService.unloadCssAndScripts();
  }
}
