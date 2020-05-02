import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {DocumentsTableComponent} from './documents-table/documents-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FlexModule} from '@angular/flex-layout';


@NgModule({
  declarations: [DocumentsTableComponent],
  exports: [
    DocumentsTableComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDatepickerModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    FlexModule,
  ]
})
export class DocumentsModule {
}
