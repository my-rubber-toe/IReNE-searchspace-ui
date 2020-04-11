import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import * as _moment from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {SearchSpaceService} from '../../shared/services/searchspace.service';
import {DocumentMetadata, Filters} from '../../shared/models/searchspace.model';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatTable} from '@angular/material/table';
import {DocumentsTableComponent} from './documents-table/documents-table.component';


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
  ],
})
export class DocumentsComponent implements OnInit {
  @Output() sendChange = new EventEmitter();
  @Output() selectedEvent = new EventEmitter();
  @ViewChild('creatorInput') creatorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('documentsTableComponent') table: DocumentsTableComponent;
  date1 = new FormControl(moment(''));
  date2 = new FormControl(moment(''));
  maxDate: Date;
  minDate: Date = new Date(1970, 0, 1);
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  authors: string[];
  selectedAuthors: string[] = [];
  filteredAuthors: Observable<string[]>;
  filters: Filters[];
  events: string[] = [];
  formControl = new FormControl();
  creatorCtrl = new FormControl();
  languageList: string[] = ['English', 'Spanish'];
  structureList: string[];
  dmgList: string[];
  tagList: string[];
  publicationFilter;
  incidentFilter;

  constructor(
    private filtersService: SearchSpaceService
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    // Smooth scroll up
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
    this.filtersService.getFilters().add(() => {
      this.filters = this.filtersService.filters;
      this.authors = this.filters[0].creators;
      this.dmgList = this.filters[0].damage_type;
      this.structureList = this.filters[0].infrastructure_type;
      this.tagList = this.filters[0].tag;
      this.filteredAuthors = this.creatorCtrl.valueChanges.pipe(
        // tslint:disable-next-line:deprecation
        startWith(null),
        map((creator: string | null) => creator ? this._filter(creator) : this.authors.slice()));
    });
    this.publicationFilter = (d: Date | null): boolean => {
      return this.table.tempDataSource.data.some(e => {
        return e.publication_date === moment(d).format('YYYY-MM-DD');
      });
    };
    this.incidentFilter = (d: Date | null): boolean => {
      return this.table.tempDataSource.data.some(e => {
        return e.incident_date === moment(d).format('YYYY-MM-DD');
      });
    };
  }

  checkEvent(event: MatDatepickerInputEvent<any>) {
    if (event.value !== null) {
      event.value = event.value.format('Y-MM-DD');
    } else {
      event.value = '';
    }
  }

  remove(creator: string): void {
    const index = this.selectedAuthors.indexOf(creator);

    if (index >= 0) {
      this.authors.push(this.selectedAuthors[index]);
      this.selectedAuthors.splice(index, 1);
    }
    this.creatorInput.nativeElement.value = '';
    this.creatorCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.authors.indexOf(event.option.viewValue);
    this.authors.splice(index, 1);
    this.selectedAuthors.push(event.option.viewValue);
    this.creatorInput.nativeElement.value = '';
    this.creatorCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.authors.filter(creator => creator.toLowerCase().indexOf(filterValue) === 0);
  }
}
