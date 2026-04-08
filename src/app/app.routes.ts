import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-module').then((m) => m.AdminModule),
  },
  {
    path: '',
    loadChildren: () => import('./user/user-module').then((m) => m.UserModule),
  },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: '**', component: NotFound },
];
