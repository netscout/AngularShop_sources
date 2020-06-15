import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

//모든 API 서비스의 기본 서비스
//abstract로 설정되어 직접 인스턴스 생성 불가
export abstract class BaseService {
  constructor(
    protected http: HttpClient,
    protected baseUrl: string
  ) {

  }

  //페이징 데이터 조회
  abstract getData<ApiResult>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<ApiResult>;

  //get 요청
  abstract get<T>(id: number): Observable<T>
  //put 요청
  abstract put<T>(item: T): Observable<T>
  //post 요청
  abstract post<T>(item: T): Observable<T>
}
