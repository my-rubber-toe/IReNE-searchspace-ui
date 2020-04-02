import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DefaultModule} from './layouts/default/default.module';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import {HttpClientModule} from '@angular/common/http';
import { fakeBackendProvider} from './shared/fakebackend/fakebackend.service';
import {MatNativeDateModule} from '@angular/material/core';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DefaultModule,
    HttpClientModule,
    MatNativeDateModule
  ],
  providers: [
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
