import { NgModule } from '@angular/core';
import {CollabRequestComponent} from './modules/collab-request/collab-request.component';
import {VisualizeComponent} from './modules/visualize/visualize.component';
import {DocumentsComponent} from './modules/documents/documents.component';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from './about/about.component';
import {HomeComponent} from './modules/home/home.component';
import {DefaultComponent} from './layouts/default/default.component';
import {PageNotFoundComponent} from './modules/page-not-found/page-not-found.component';
import { XyComponent } from './modules/xy/xy.component';
import { TimelineComponent } from './modules/timeline/timeline.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {path: '', component: HomeComponent},
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
      },
      {
        path: 'xy',
        component: XyComponent
      },
      {
        path: 'timeline',
        component: TimelineComponent
      }],
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
