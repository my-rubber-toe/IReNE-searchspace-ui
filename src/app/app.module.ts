import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollabRequestComponent } from './modules/collab-request/collab-request.component';
import { DocumentsComponent } from './modules/documents/documents.component';
import { VisualizeComponent } from './modules/visualize/visualize.component';
@NgModule({
  declarations: [
    AppComponent,
    CollabRequestComponent,
    DocumentsComponent,
    VisualizeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
