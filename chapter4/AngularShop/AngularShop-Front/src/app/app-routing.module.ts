import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent, CategoriesPageComponent,
  CartPageComponent, ContactPageComponent,
  CheckoutPageComponent, ProductPageComponent} from './pages';
import { AdminProductListComponent } from './admin';

//URL에 따른 라우팅 규칙 정의
const routes: Routes = [
  {
    //localhost:4200/ 의 경우 MainComponent가 표시되도록
    path: '',
    component: MainPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'categories',
    component: CategoriesPageComponent
  },
  {
    path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'contact',
    component: ContactPageComponent
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent
  },
  {
    path: 'product',
    component: ProductPageComponent
  },
  {
    path: 'admin-products',
    component: AdminProductListComponent
  },


  // 규칙에 맞지 않는 URL의 경우 메인으로 이동
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
