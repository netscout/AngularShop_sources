import { Injectable } from "@angular/core";
import { environment } from "@envs/environment";
import { HttpParams } from '@angular/common/http';

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

  getQueryParams(
    pageIndex: string,
    pageSize: string,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ) {
    var params = new HttpParams()
      .set("pageIndex", pageIndex)
      .set("pageSize", pageSize)

    if(environment.DRF)
    {
      var sortDirection = "";
      if(sortOrder === "desc") {
        sortDirection = "-";
      }

      params = params.set(
        "ordering",
        `${sortDirection}${this.toSnake(sortColumn)}`);

      if(filterQuery) {
        params = params.set(
          filterColumn,
          this.toSnake(filterQuery));
      }
    }
    else {
      params
        .set("sortColumn", sortColumn)
        .set("sortOrder", sortOrder);

      if(filterQuery) {
        params = params
          .set("filterColumn", filterColumn)
          .set("filterQuery", filterQuery);
      }
    }

    return params
  }

  //객체의 속성 중 이름이 스네이크 케이스(abc_def)형식인 것을
  //캐멀 케이스(abcDef)로 변환
  keysToCamel(o) {
    return this.keysTo(o, this.toCamel);
  }

  //객체의 속성 중 이름이 캐멀 케이스(abcDef)형식인 것을
  //스네이크 케이스(abc_def)로 변환
  keysToSnake(o) {
    return this.keysTo(o, this.toSnake);
  }

  //http://jsfiddle.net/ms734bqn/1/
  private keysTo(o, toFn) {
    if (this.isObject(o)) {
      const n = {};

      Object.keys(o)
        .forEach((k) => {
          n[toFn(k)] = this.keysTo(o[k], toFn);
        });

      return n;
    } else if (this.isArray(o)) {
      return o.map((i) => {
        return this.keysTo(i, toFn);
      });
    }

    return o;
  }

  private toCamel = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  };

  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
  private toSnake = (s) => {
    var upperToSnake = function(match, offset, string) {
      return (offset > 0 ? "_" : "") + match.toLowerCase()
    }
    return s.replace(/[A-Z]/g, upperToSnake);
  };

  private isArray = function (a) {
    return Array.isArray(a);
  };

  private isObject = function (o) {
    return o === Object(o)
      && !this.isArray(o)
      && typeof o !== 'function';
  };
}
