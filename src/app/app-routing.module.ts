import {NgModule} from '@angular/core';
import {CollabrequestComponent} from './modules/collabrequest/collabrequest.component';
import {DocumentsComponent} from './modules/documents/documents.component';
import {RouterModule, Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {DefaultComponent} from './layouts/default/default.component';
import {PageNotFoundComponent} from './modules/page-not-found/page-not-found.component';
import {XyComponent} from './modules/xy/xy.component';
import {MapComponent} from './modules/map/map.component';
import {PreviewComponent} from './layouts/preview/preview.component';
import {TimelineComponent} from './modules/timeline/timeline.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'home'},
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
      path: 'about',
      component: AboutComponent,
      },
      {
        path: 'collabrequest',
        loadChildren: () => import('./modules/collabrequest/collabrequest.module').then(m => m.CollabrequestModule)
      },
      {
        path: 'documents',
        loadChildren: () => import('./modules/documents/documents.module').then(m => m.DocumentsModule)
      },
      {
        path: 'map',
        loadChildren: () => import('./modules/map/map.module').then(m => m.MapModule)
      },
      {
        path: 'xy',
        loadChildren: () => import('./modules/xy/xy.module').then(m => m.XyModule)
      },
      {
        path: 'timeline',
        loadChildren: () => import('./modules/timeline/timeline.module').then(m => m.TimelineModule)
      },
      {
        path: 'preview/:docId',
        loadChildren: () => import('./layouts/preview/preview.module').then(m => m.PreviewModule)
      },
      { path: '**', component: PageNotFoundComponent },
      ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
