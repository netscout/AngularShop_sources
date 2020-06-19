import { Component, OnInit } from '@angular/core';
import categoryMenus from 'src/app/models/categoryMenus';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  categoryMenus: [string, number][] = categoryMenus;

  constructor() { }

  public get isAdmin(): boolean {
    //일단은 개발을 위해 무조건 어드민으로 세팅
    return false;
  }

  ngOnInit(): void {
  }

}
