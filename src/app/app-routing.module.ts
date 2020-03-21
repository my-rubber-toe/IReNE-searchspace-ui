import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CollabRequestComponent} from './modules/collab-request/collab-request.component';
import {VisualizeComponent} from './modules/visualize/visualize.component';
import {DocumentsComponent} from './modules/documents/documents.component';
import {AppComponent} from './app.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
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
