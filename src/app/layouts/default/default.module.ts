import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DefaultComponent} from './default.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AboutComponent} from '../../about/about.component';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    DefaultComponent,
    AboutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatCardModule,
  ],
    providers: [
      DatePipe
    ]
})
export class DefaultModule { }
