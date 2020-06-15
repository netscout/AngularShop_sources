import { Injectable } from "@angular/core";
import { environment } from "@envs/environment";

//앱 어디에서나 생성자를 통해 주입 가능
@Injectable({providedIn: 'root'})
export class CommonService {
  //동적으로 css파일을 삽입
  loadCss(
    src: string,
    onload: any,
    async = true,
    inner_text_content = ''): void {
    if (typeof document !== 'undefined') {
      let pagecss_div = document.getElementById("pagecss-div");

      // css파일을 추가하기 위한 link 요소 생성
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = `${environment.baseUrl}${src}`;
      link.onload = onload;

      //pagecss_div에 삽입
      pagecss_div.appendChild(link);
    }
  }

  //동적으로 js파일을 삽입
  loadScript(
    src: string,
    onload: any,
    async = true,
    inner_text_content = ''): void {
    if (typeof document !== 'undefined') {
      let pagejs_div = document.getElementById("pagejs-div");

      //js파일을 추가하기 위한 script요소 생성
      let js = document.createElement('script');
      js.async = async;

      //외부 사이트에서 로드하는 거라면 주소 그대로
      if(src.startsWith("http")) {
        js.src = src;
      }
      else {
        js.src = `${environment.baseUrl}${src}`;
      }
      js.onload = onload;

      pagejs_div.appendChild(js);
    }
  }

  //동적으로 로드한 css와 js파일을 삭제
  unloadCssAndScripts() {
    let pagecss_div = document.getElementById("pagecss-div");
    while (pagecss_div.firstChild) {
      pagecss_div.removeChild(pagecss_div.lastChild);
    }

    let pagejs_div = document.getElementById("pagejs-div");
    while (pagejs_div.firstChild) {
      pagejs_div.removeChild(pagejs_div.lastChild);
    }
  }
}
