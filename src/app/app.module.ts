import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SubjectService } from './services/subject.service';
import { ApiClientService } from './services/api-client.service';
import { SharedModule } from './modules/shared/shared.module';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { ExternalLayoutComponent } from './components/external-layout/external-layout.component';
import { NewItemDialogComponent } from './components/new-item-dialog/new-item-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteRecordDialogComponent } from './components/delete-record-dialog/delete-record-dialog.component';
import { AppService } from './services/app.service';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    HomeLayoutComponent,
    ExternalLayoutComponent,
    NewItemDialogComponent,
    DeleteRecordDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    SubjectService,
    ApiClientService,
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
