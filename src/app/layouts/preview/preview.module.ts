import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {PreviewComponent} from './preview.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    PreviewComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    // NgxExtendedPdfViewerModule
  ],
  providers: [
    DatePipe
  ]
})
export class PreviewModule { }
