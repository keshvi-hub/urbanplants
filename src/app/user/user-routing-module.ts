import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayout } from './layout/user-layout/user-layout';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Products } from './pages/products/products';
import { Myorder } from './pages/myorder/myorder';
import { Cart } from './pages/cart/cart';
import { PaymentSuccess } from './pages/payment-success/payment-success';
import { Wishlist } from './pages/wishlist/wishlist';


const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', component: Home },
      { path: 'products', component: Products },
      { path: 'contact', component: Contact },
      { path: 'about', component: About },
      { path: 'product/:id', component: ProductDetail },
      { path: 'myorder', component: Myorder },
      { path: 'cart', component: Cart },
      { path: 'payment-success', component: PaymentSuccess },
      { path: 'wishlist', component: Wishlist },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
