import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactPageComponent implements OnInit, OnDestroy {

  constructor(
    private commonService: CommonService
  ) { }

  //페이지 컴포넌트가 초기화 될 때
  ngOnInit(): void {
    this.commonService.loadCss(
      "assets/styles/contact.css",
      () => {
        this.commonService.loadCss(
          "assets/styles/contact_responsive.css",
          () => {
            this.commonService.loadScript(
              "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCIwF204lFZg1y4kPSIhKaHEXMLYxxuMhA",
              () => {
                this.commonService.loadScript(
                  "assets/js/contact.js",
                  () => {

                  });
              });
          });
      });
  }

  //다른 페이지 컴포넌트로 이동 할 때
  ngOnDestroy() {
    this.commonService.unloadCssAndScripts();
  }

}
