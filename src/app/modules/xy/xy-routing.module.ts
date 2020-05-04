import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {XyComponent} from './xy.component';

const routes: Routes = [
  {
    path: '',
    component: XyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XyRoutingModule { }
