import { Component, OnInit } from '@angular/core';
import categoryMenus from 'src/app/models/categoryMenu';
import { AuthenticationService }
  from 'src/app/services/authentication.service';
import { Roles } from 'src/app/models/roles';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  categoryMenus: [string, number][] = categoryMenus;

  constructor(
    private authService: AuthenticationService
  ) { }

  public get isLoggedIn() : boolean {
    return this.authService.isLoggedIn;
  }

  public get getUserName(): string {
    return this.authService.currentUserValue.name;
  }

  public get getPhotoUrl(): string {
    return this.authService.currentUserValue.photoUrl;
  }

  public get isAdmin(): boolean {
    if(this.isLoggedIn)
    {
      const currentUser = this.authService.currentUserValue;

      return currentUser.roles.includes(Roles.Admin);
    }

    return false;
  }

  ngOnInit(): void {
  }

}
