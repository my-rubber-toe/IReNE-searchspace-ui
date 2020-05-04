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
import {XyRoutingModule} from './xy-routing.module';
import {XyComponent} from './xy.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatSelectModule} from '@angular/material/select';
import {GoogleChartsModule} from 'angular-google-charts';

// import { AppComponent } from 'src/app/app.component';


@NgModule({
  declarations: [XyComponent],
  imports: [
    CommonModule,
    XyRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDatepickerModule,
    MatIconModule,
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
