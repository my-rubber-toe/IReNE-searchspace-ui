import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {PreviewComponent} from './preview.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {PreviewRoutingModule} from './preview-routing.module';
import { PreviewPipe } from './preview.pipe';

@NgModule({
  declarations: [
    PreviewComponent,
    PreviewPipe,
  ],
  imports: [
    CommonModule,
    PreviewRoutingModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
  ],
  providers: [
    DatePipe
  ]
})
export class PreviewModule { }
