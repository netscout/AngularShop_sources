import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent, CategoriesPageComponent,
  CartPageComponent, ContactPageComponent,
  CheckoutPageComponent, ProductPageComponent} from './pages';
import { AdminProductListComponent,
  AdminCategoryListComponent,
  AdminCategoryEditComponent, AdminProductEditComponent} from './admin';

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
  {
    path: 'admin-product-new',
    component: AdminProductEditComponent
  },
  //admin-product-edit/3 -> :id에 3이 설정됨
  {
    path: 'admin-product-edit/:id',
    component: AdminProductEditComponent
  },
  {
    path: 'admin-categories',
    component: AdminCategoryListComponent
  },
  {
    path: 'admin-category-new',
    component: AdminCategoryEditComponent
  },
  //admin-category-edit/3 -> :id에 3이 설정됨
  {
    path: 'admin-category-edit/:id',
    component: AdminCategoryEditComponent
  },

  // 규칙에 맞지 않는 URL의 경우 메인으로 이동
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
