import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent, CategoriesPageComponent,
  CartPageComponent, ContactPageComponent,
  CheckoutPageComponent, ProductPageComponent,
  RegisterPageComponent,
  LoginPageComponent,
  LogoutPageComponent} from './pages';
import { AdminProductListComponent,
  AdminCategoryListComponent,
  AdminCategoryEditComponent,
  AdminProductEditComponent,
  AdminOrderListComponent,
  AdminOrderEditComponent } from './admin';
import { AuthGuard } from './api-auth';
import { Roles } from './models/roles';

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
    path: 'category/:id',
    component: CategoriesPageComponent
  },
  {
    path: 'cart',
    component: CartPageComponent,
    canActivate: [AuthGuard] //로그인 필요
  },
  {
    path: 'contact',
    component: ContactPageComponent
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent,
    canActivate: [AuthGuard] //로그인 필요
  },
  {
    path: 'product/:id',
    component: ProductPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: 'register/:provider',
    component: RegisterPageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'logout',
    component: LogoutPageComponent,
    canActivate: [AuthGuard] //로그인 필요
  },

  //-----------관리자 라우트-------------
  {
    path: 'admin-products',
    component: AdminProductListComponent,
    canActivate: [AuthGuard], //로그인 필요
    data: {
      roles: [Roles.Admin] //관리자 역할 필요
    }
  },
  {
    path: 'admin-product-new',
    component: AdminProductEditComponent,
    canActivate: [AuthGuard], //로그인 필요
    data: {
      roles: [Roles.Admin] //관리자 역할 필요
    }
  },
  //admin-product-edit/3 -> :id에 3이 설정됨
  {
    path: 'admin-product-edit/:id',
    component: AdminProductEditComponent,
    canActivate: [AuthGuard], //로그인 필요
    data: {
      roles: [Roles.Admin] //관리자 역할 필요
    }
  },
  {
    path: 'admin-categories',
    component: AdminCategoryListComponent,
    canActivate: [AuthGuard], //로그인 필요
    data: {
      roles: [Roles.Admin] //관리자 역할 필요
    }
  },
  {
    path: 'admin-category-new',
    component: AdminCategoryEditComponent,
    canActivate: [AuthGuard], //로그인 필요
    data: {
      roles: [Roles.Admin] //관리자 역할 필요
    }
  },
  //admin-category-edit/3 -> :id에 3이 설정됨
  {
    path: 'admin-category-edit/:id',
    component: AdminCategoryEditComponent,
    canActivate: [AuthGuard], //로그인 필요
    data: {
      roles: [Roles.Admin] //관리자 역할 필요
    }
  },
  {
    path: 'admin-orders',
    component: AdminOrderListComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Roles.Admin]
    }
  },
  {
    path: 'admin-order-edit/:id',
    component: AdminOrderEditComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Roles.Admin]
    }
  },

  // 규칙에 맞지 않는 URL의 경우 메인으로 이동
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
