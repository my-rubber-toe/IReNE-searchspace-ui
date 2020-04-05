import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import * as _moment from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {Moment} from 'moment';
import {SearchSpaceService} from '../../shared/services/searchspace.service';
import {Filters} from '../../shared/Models/searchspace.model';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';


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
  @Output() selectedEvent = new EventEmitter();
  @ViewChild('creatorInput') creatorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  date1 = new FormControl(moment(''));
  date2 = new FormControl(moment(''));
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  creators: string[];
  selectedCreators: string[] = [];
  filteredCreators: Observable<string[]>;
  filters: Filters[];
  events: string[] = [];
  formControl = new FormControl();
  creatorCtrl = new FormControl();
  // locationList: string[] = ['Arecibo', 'Ponce', 'Mayagüez', 'Caguas', 'Cabo Rojo'];
  languageList: string[] = ['English', 'Spanish'];
  structureList: string[];
  dmgList: string[];
  tagList: string[];

  checkEvent(event: MatDatepickerInputEvent<any> ) {
    if (event.value !== null) {
      event.value = event.value.format('Y-MM-DD');
      console.log(event.value);
    } else {
      event.value = '';
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.selectedCreators.push(value.trim());
    }
    if (input) {
      input.value = '';
    }

    this.creatorCtrl.setValue(null);
  }

  remove(creator: string): void {
    const index = this.selectedCreators.indexOf(creator);

    if (index >= 0) {
      this.selectedCreators.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
    this.selectedCreators.push(event.option.viewValue);
    this.creatorInput.nativeElement.value = '';
    this.creatorCtrl.setValue(null);
    this.selectedEvent.emit(this.selectedCreators);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.creators.filter(creator => creator.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(
    private filtersService: SearchSpaceService
  ) {
  }

  ngOnInit(): void {
    this.filtersService.getFilters().add(() => {
      this.filters = this.filtersService.filters;
      this.creators = this.filters[0].creators;
      this.dmgList = this.filters[0].damage_type;
      this.structureList = this.filters[0].infrastructure_type;
      this.tagList = this.filters[0].tag;
      this.filteredCreators = this.creatorCtrl.valueChanges.pipe(
        startWith(null),
        map((creator: string | null) => creator ? this._filter(creator) : this.creators.slice()));
    });
  }
}
