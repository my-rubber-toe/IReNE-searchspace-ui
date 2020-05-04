import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TimelineRoutingModule} from './timeline-routing.module';
import {TimelineComponent} from './timeline.component';
import {MatSelectModule} from '@angular/material/select';
import {GoogleChartsModule} from 'angular-google-charts';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [TimelineComponent],
  imports: [
    CommonModule,
    TimelineRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDatepickerModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    GoogleChartsModule,
    FlexLayoutModule
  ]
})
export class TimelineModule {
}
