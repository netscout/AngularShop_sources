import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@envs/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

declare let Kakao: any;

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>

  //현재 로그인 되어 있는지 여부를 체크
  public get isLoggedIn(): boolean {
    let user = this.currentUserValue;

    if(!user) {
      return false;
    }

    //JWT토큰의 만료 시간과 현재 시간을 비교하여 로그인 여부 확인
    const now = new Date().getTime();
    let isLoggedIn = now <= Date.parse(user.expires);

    //로그인이 유효하지 않다면
    if(!isLoggedIn) {
      return false;
    }

    return isLoggedIn;
  }

  //현재 로그인한 사용자의 정보 가져오기
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  protected _readyState: BehaviorSubject<boolean> =
    new BehaviorSubject(false);

  constructor(
    private http: HttpClient
  ) {
    //브라우저의 로컬 스토리지에서 사용자 로그인 정보 확인
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(
    email: string,
    password:string,
    confirmPassword: string
  ) : Observable<any> {
    let url = `${environment.baseUrl}api/Account`;
    let params = {};

    params["email"] = email;
    params["password"] = password;
    params["confirmPassword"] = confirmPassword;

    return this.http.post<any>(url, params);
  }

  //로그인-------------------------------------------------------
  initKakaoLogin() {
    return new Promise((resolve, reject) => {
      this.loadScript('kakao',
        'https://developers.kakao.com/sdk/js/kakao.min.js',
        () => {
          Kakao.init("...");

          //카카오 로그인 API가 초기화 되면
          if(Kakao.isInitialized())
          {
            //카카오 로그인 버튼 생성
            Kakao.Auth.createLoginButton({
              container: "#kakao-login-btn",
              success: (result) => {
                //로그인 성공시
                let expires = result.expires_in;

                //회원 정보를 가져와서 다음 처리에 넘김
                Kakao.API.request({
                  url: '/v2/user/me',
                  success: (res) => {
                    resolve({ res, expires });
                  }
                })
              },
              fail: (err) => {
                reject(err);
              }
            })
          }
        });
    });
  }

  //이미 등록된 소셜 로그인인지 확인
  checkSocialLogin(provider: string, providerKey: string) {
    let url = `${environment.baseUrl}api/Token/CheckSocialLogin`;
    let params = {
      provider: provider,
      name: "",
      email: "",
      providerKey: providerKey,
      photoUrl: ""
    }
    return this.http.post<any>(url, params);
  }

  login(userInfo: any, provider: string = "default" ) {
    switch (provider) {
      case "google":
        return this.extGoogleLogin(userInfo);
        break;
      case "kakao":
        return this.extKakaoLogin(userInfo);
        break;
      default:
        return this.defaultLogin(userInfo);
        break;
    }
  }

  extGoogleLogin(userInfo: any) {
    let url = `${environment.baseUrl}api/Token/SocialLogin`;

    let params = {
      name: userInfo.name,
      email: userInfo.email,
      providerKey: userInfo.id,
      photoUrl: userInfo.photoUrl,
      provider: userInfo.provider
    }

    return this.loginBase(url, params);
  }

  extKakaoLogin(userInfo: any) {
    let url = `${environment.baseUrl}api/Token/SocialLogin`;

    return this.loginBase(url, userInfo);
  }

  defaultLogin(userInfo: any) {
    let url = `${environment.baseUrl}api/Token`;
    let email = userInfo.email;
    let password = userInfo.password;

    return this.loginBase(url, { email, password });
  }

  private loginBase(url: string, params: any) {
    return this.http.post<any>(url, params)
      .pipe(map(u => {
        //로그인 성공시 localStorage에 사용자 정보 저장
        localStorage.setItem('currentUser', JSON.stringify(u));
        this.currentUserSubject.next(u);
        return u;
      }));
  }

  //로그아웃-----------------------------------------------------
  logout() {
    return new Promise((resolve, reject) => {
      let url = `${environment.baseUrl}api/Token`
      this.http.delete<any>(url, {})
        .subscribe(data => {
          //로그아웃 성공시 후 처리로 이동
          resolve();
        },
        error => reject(error))
        .add(() => {
          //로그아웃 호출 성공/실패 상관없이 사용자 정보 삭제
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
        });
    });
  }

  handleKakaoLogout() {
    return new Promise((resolve, reject) => {
      this.loadScript('kakao',
        'https://developers.kakao.com/sdk/js/kakao.min.js',
        () => {
          Kakao.init("...");

          if(Kakao.isInitialized()
            && Kakao.Auth.getAccessToken()) {
            Kakao.Auth.logout(() => {
              resolve();
            })
          }
          else {
            reject(new Error("카카오 계정으로 로그인 되지 않았습니다."));
          }
        });
    });
  }

  //특정 키를 가진 항목은 제외하고 중복 검사
  isDupeField(
    id,
    fieldName,
    fieldValue
  ): Observable<boolean> {
    let params = new HttpParams()
      .set("id", id)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);

    let url = `${environment.baseUrl}api/Account/IsDupeField`;

    return this.http.post<boolean>(url, null, { params });
  }

  loadScript(
    id: string,
    src: string,
    onload: any,
    async = true): void {
    // get document if platform is only browser
    if (typeof document !== 'undefined' && !document.getElementById(id)) {
        let signInJS = document.createElement('script');
        signInJS.async = async;
        signInJS.src = src;
        signInJS.onload = onload;

        document.head.appendChild(signInJS);
    }
  }
}
