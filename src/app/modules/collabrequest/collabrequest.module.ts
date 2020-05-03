import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CollabrequestComponent} from './collabrequest.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CollabrequestRoutingModule} from './collabrequest-routing.module';



@NgModule({
  declarations: [CollabrequestComponent],
  imports: [
    CommonModule,
    CollabrequestRoutingModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule
  ]
})
export class CollabrequestModule { }
