/*
  Author: Jainel M. Torres Santos <jainel.torres@upr.edu>
*/
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {XyRoutingModule} from './xy-routing.module';
import {XyComponent} from './xy.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatSelectModule} from '@angular/material/select';
import {GoogleChartsModule} from 'angular-google-charts';

@NgModule({
  declarations: [XyComponent],
  imports: [
    CommonModule,
    XyRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatSelectModule,
    GoogleChartsModule
  ]
})
export class XyModule {
}
