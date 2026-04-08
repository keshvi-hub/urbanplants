import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { User } from './pages/user/user';
import { Category } from './pages/category/category';
import { Addcategory } from './pages/addcategory/addcategory';
import { EditCategory } from './pages/editcategory/editcategory';
import { AddProduct } from './pages/add-product/add-product';
import { ShowProduct } from './pages/show-product/show-product';
import { EditProduct } from './pages/edit-product/edit-product';
import { Settings } from './pages/settings/settings';
import { Allorder } from './pages/allorder/allorder';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'showuser', component: User },
      { path: 'category', component: Category },
      { path: 'category/add', component: Addcategory },
      { path: 'category/edit/:id', component: EditCategory },
      { path: 'products', component: ShowProduct },
      { path: 'products/add', component: AddProduct },
      { path: 'products/edit/:id', component: EditProduct },
      { path: 'settings', component: Settings },
      { path: 'orders', component: Allorder },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
