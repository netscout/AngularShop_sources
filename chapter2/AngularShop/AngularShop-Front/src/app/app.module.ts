import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent, FooterComponent, SmallMenuComponent,
  HomeSliderComponent, HomeAdsComponent,
  ProductListItemComponent, HomeIconBoxesComponent,
  HomeNewsletterComponent } from './shared';
import { MainPageComponent, CategoriesPageComponent,
  ProductPageComponent, CartPageComponent,
  CheckoutPageComponent, ContactPageComponent } from './pages';

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
    ContactPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
