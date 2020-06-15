import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './modules/angular-material.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent, FooterComponent, SmallMenuComponent,
  HomeSliderComponent, HomeAdsComponent,
  ProductListItemComponent, HomeIconBoxesComponent,
  HomeNewsletterComponent } from './shared';
import { MainPageComponent, CategoriesPageComponent,
  ProductPageComponent, CartPageComponent,
  CheckoutPageComponent, ContactPageComponent } from './pages';
import { AdminHeaderComponent,
  AdminProductListComponent } from './admin';
import { CustomDatePipe } from './services/custom.datepipe';

@NgModule({
  declarations: [
    AppComponent,
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
    CustomDatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
