import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";

@Pipe({
    name: 'customDate'
})

export class CustomDatePipe extends
  DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    //시간을 모두 utc 기준이어야 하므로
    //날짜 문자열 끝에 utc를 나타내는 z가 없다면 붙인다.
    if(!value.toLowerCase().endsWith("z")) {
      value = value + "z";
    }
    //날짜를 현재 시간으로 변환
    let date = new Date(value);
    //보기 편한 형태로 변경
    return super.transform(date, "yyyy/MM/dd HH:mm:ss");
  }
}
