import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './modules/angular-material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExternalLoginModule } from "./modules/app-external-login.module";

import { AppComponent } from './app.component';
import { BaseFormComponent } from './base.form.component';
import { BaseTreeFormComponent } from './base.tree-form.component';
import { HeaderComponent, FooterComponent, SmallMenuComponent,
  HomeSliderComponent, HomeAdsComponent,
  ProductListItemComponent, HomeIconBoxesComponent,
  HomeNewsletterComponent } from './shared';
import { MainPageComponent, CategoriesPageComponent,
  ProductPageComponent, CartPageComponent,
  CheckoutPageComponent, ContactPageComponent,
  RegisterPageComponent, LoginPageComponent,
  LogoutPageComponent } from './pages';
import { AdminHeaderComponent,
  AdminProductListComponent, AdminCategoryListComponent,
  AdminCategoryEditComponent, AdminProductEditComponent } from './admin';
import { CustomDatePipe } from './services/custom.datepipe';
import { JwtInterceptor, ErrorInterceptor } from './api-auth';

@NgModule({
  declarations: [
    AppComponent,
    BaseFormComponent,
    BaseTreeFormComponent,
    HeaderComponent,
    FooterComponent,
    SmallMenuComponent,
    HomeSliderComponent,
    HomeAdsComponent,
    ProductListItemComponent,
    HomeNewsletterComponent,
    MainPageComponent,
    CategoriesPageComponent,
    HomeIconBoxesComponent,
    ProductPageComponent,
    CartPageComponent,
    CheckoutPageComponent,
    ContactPageComponent,
    AdminHeaderComponent,
    AdminProductListComponent,
    CustomDatePipe,
    AdminCategoryListComponent,
    AdminCategoryEditComponent,
    AdminProductEditComponent,
    RegisterPageComponent,
    LoginPageComponent,
    LogoutPageComponent,
    AdminOrderListComponent,
    AdminOrderEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ExternalLoginModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
