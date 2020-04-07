import { NgModule } from '@angular/core';
import {CollabRequestComponent} from './modules/collab-request/collab-request.component';
import {DocumentsComponent} from './modules/documents/documents.component';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from './about/about.component';
import {HomeComponent} from './modules/home/home.component';
import {DefaultComponent} from './layouts/default/default.component';
import {PageNotFoundComponent} from './modules/page-not-found/page-not-found.component';
import { XyComponent } from './modules/xy/xy.component';
import { MapComponent } from './modules/map/map.component';

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
        path: 'map',
        component: MapComponent
      },
      {
        path: 'xy',
        component: XyComponent
      }],
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
