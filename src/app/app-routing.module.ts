import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalLayoutComponent } from './components/external-layout/external-layout.component';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { NavegacionGuardService } from './guards/navigation.guard';

const routes: Routes = [
  {
    path: '',
    component: ExternalLayoutComponent,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeLayoutComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin-site/admin-site.module').then(m => m.AdminSiteModule),
        canActivate: [NavegacionGuardService]
      },
      {
        path: 'guest',
        loadChildren: () => import('./modules/guest-site/guest-site.module').then(m => m.GuestSiteModule),
      }
    ]
  },
  {
    path: 'admin-login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
    canActivate: [NavegacionGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
