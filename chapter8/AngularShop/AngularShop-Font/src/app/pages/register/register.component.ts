import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, AsyncValidatorFn,
  AbstractControl } from "@angular/forms";
import { map, first } from "rxjs/operators";

import { BaseFormComponent } from "src/app/base.form.component";
import { AuthenticationService }
  from "src/app/services/authentication.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterPageComponent
  extends BaseFormComponent
  implements OnInit {
  loading = false;
  error = '';
  provider = "";

  //회원 가입 성공 후 이메일 확인 표시에 필요
  registerSucceed = false;
  name = "";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.provider = this.route.snapshot.paramMap.get('provider');

    let formGroup = {};
    let validator = {};

    formGroup["email"] = ['',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ],
      this.isDupeField("email")
    ];

    //일반 회원 가입에는 패스워드 필요
    if(this.needPassword())
    {
      formGroup["password"] = ['',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[#$^+=!*()@%&]).{8,}$')
        ]
      ];
      formGroup["confirmPassword"] = ['',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[#$^+=!*()@%&]).{8,}$')
        ]
      ];
      validator["validator"] = this.checkPasswordConfirm;
    }

    this.form = this.formBuilder
      .group(formGroup, validator);
  }

  onSubmit() {
    this.loading = true;

    //카카오 로그인의 경우
    if(this.fromKakao()) {
      //로컬 스토리지에서 카카오 로그인 정보 가져오기
      let kakaoLoginInfo = JSON.parse(localStorage.getItem('kakao'));

      let returnUrl = kakaoLoginInfo.returnUrl;

      //사용자 정보에 이메일을 추가하여 소셜 로그인 처리
      let user = {
        email: this.getValue("email"),
        providerKey: kakaoLoginInfo.providerKey,
        name: kakaoLoginInfo.name,
        photoUrl: kakaoLoginInfo.photoUrl,
        expires: kakaoLoginInfo.expires,
        provider: "kakao"
      };

      this.authService.login(user, "kakao")
        .pipe(first())
        .subscribe(
          data => {
            localStorage.removeItem('kakao');
            this.router.navigate([returnUrl]);
          },
          error => {
            this.error = error;
          }
        )
        .add(() => {
          this.loading = false;
        });
    }
    else {
      //회원 가입 진행
      this.authService.register(
        this.getValue("email"),
        this.getValue("password"),
        this.getValue("confirmPassword")
      )
        .subscribe(
          data => {
            //회원 가입 성공 안내 후 로그인 페이지로 안내
            this.registerSucceed = true;
            this.name = data.name;
          },
          error => {
            //회원 가입 실패
            this.error = error;
          }
        )
        .add(() => {
          this.loading = false;
        });
    }


  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl):
      Observable<{[key: string]: any} | null> => {
        return this.authService.isDupeField(
          0,
          fieldName,
          control.value)
          .pipe(map(result => {
            return (result ? { isDupeField: true } : null);
          }));
      }
  }

  fromKakao() {
    return this.provider === "kakao";
  }

  needPassword() {
    return !this.fromKakao();
  }
}
