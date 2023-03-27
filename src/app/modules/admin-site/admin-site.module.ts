import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSiteRoutingModule } from './admin-site-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    AdminSiteRoutingModule,
    SharedModule
  ]
})
export class AdminSiteModule { }
