import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { RouterModule } from '@angular/router';
import {  SharedModule } from '../../shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {DocumentsComponent} from '../../modules/documents/documents.component';
import {CollabRequestComponent} from '../../modules/collab-request/collab-request.component';
import {HomeComponent} from '../../modules/home/home.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AboutComponent} from '../../about/about.component';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';
import {HomeModule} from '../../modules/home/home.module';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {DocumentsModule} from '../../modules/documents/documents.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { XyModule } from 'src/app/modules/xy/xy.module';
import { XyComponent } from 'src/app/modules/xy/xy.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { MapComponent } from 'src/app/modules/map/map.component';



@NgModule({
  declarations: [
    DefaultComponent,
    DocumentsComponent,
    CollabRequestComponent,
    AboutComponent,
    HomeComponent,
    XyComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule,
    HomeModule,
    DocumentsModule,
    MatGridListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatAutocompleteModule,
    XyModule,
    GoogleChartsModule.forRoot()
  ]
})
export class DefaultModule { }
