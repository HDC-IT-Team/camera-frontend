import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestSiteRoutingModule } from './guest-site-routing.module';
import { PhotoComponent } from './components/photo/photo.component';


@NgModule({
  declarations: [
    PhotoComponent
  ],
  imports: [
    CommonModule,
    GuestSiteRoutingModule
  ]
})
export class GuestSiteModule { }
