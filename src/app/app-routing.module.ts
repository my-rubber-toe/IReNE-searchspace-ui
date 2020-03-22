import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CollabRequestComponent} from './modules/collab-request/collab-request.component';
import {VisualizeComponent} from './modules/visualize/visualize.component';
import {DocumentsComponent} from './modules/documents/documents.component';
import {AppComponent} from './app.component';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from './about/about.component';
import {HomeComponent} from './modules/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'collab-request',
    component: CollabRequestComponent
  },
  {
    path: 'documents',
    component: DocumentsComponent
  },
  {
    path: 'visualize',
    component: VisualizeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
