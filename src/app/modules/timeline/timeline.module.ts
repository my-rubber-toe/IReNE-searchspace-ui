/*
  Author: Jainel M. Torres Santos <jainel.torres@upr.edu>
*/
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TimelineRoutingModule} from './timeline-routing.module';
import {TimelineComponent} from './timeline.component';
import {MatSelectModule} from '@angular/material/select';
import {GoogleChartsModule} from 'angular-google-charts';


@NgModule({
  declarations: [TimelineComponent],
  imports: [
    CommonModule,
    TimelineRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    GoogleChartsModule,
  ]
})
export class TimelineModule {
}
