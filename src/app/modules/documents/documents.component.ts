import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import * as _moment from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {Moment} from 'moment';


const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'Y-MM-DD',
  },
  display: {
    dateInput: 'Y-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'Y-MM-DD',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DocumentsComponent implements OnInit {
  @Output() sendChange = new EventEmitter();
  date = new FormControl(moment());
  events: string[] = [];
  formControl = new FormControl();
  // locationList: string[] = ['Arecibo', 'Ponce', 'Mayagüez', 'Caguas', 'Cabo Rojo'];
  languageList: string[] = ['English', 'Spanish'];
  structureList: string[] = ['Building', 'Bridge'];
  dmgList: string[] = ['Fire', 'Flooding', 'Broken Sewer'];
  tagList: string[] = ['Hurricane', 'Flood'];

  checkEvent(event: MatDatepickerInputEvent<any> ) {
    if (event.value !== null) {
      event.value = event.value.format('Y-MM-DD');
      console.log(event.value);
    } else {
      event.value = '';
    }
  }


  constructor() { }

  ngOnInit(): void {
  }
}
