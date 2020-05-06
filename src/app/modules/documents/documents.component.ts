import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import {SearchSpaceService} from '../../shared/services/searchspace.service';
import {Filters} from '../../shared/models/searchspace.model';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {DocumentsTableComponent} from './documents-table/documents-table.component';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {SearchComponent} from '../home/search/search.component';
import {DateHeaderComponent} from './date-header.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentsComponent implements OnInit, AfterViewInit {
  @Output() sendChange = new EventEmitter();
  @Output() selectedEvent = new EventEmitter();
  @ViewChild('creatorInput') creatorInput: ElementRef<HTMLInputElement>;
  @ViewChild('searchComponent') search: SearchComponent;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('documentsTableComponent') table: DocumentsTableComponent;
  date1 = new FormControl({value: '', disabled: true});
  date2 = new FormControl({value: '', disabled: true});
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
  formControl = new FormControl({value: '', disabled: true});
  creatorCtrl = new FormControl({value: '', disabled: true});
  languageList: string[] = ['English', 'Spanish'];
  structureList: string[];
  dmgList: string[];
  tagList: string[];
  dateFilter;
  yearSelected = false;
  monthSelected = false;
  dateHeaderComponent = DateHeaderComponent;
  private falseYears = [];
  private falseMonths = [];
  private picker = {
    selected: ''
  };

  constructor(
    private filtersService: SearchSpaceService,
    private datePipe: DatePipe,
    public route: ActivatedRoute
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.filtersService.getFilters().add(() => {
      this.filters = this.filtersService.filters;
      this.authors = this.filters[`authors`];
      this.dmgList = this.filters[`damages`];
      this.structureList = this.filters[`infrastructures`];
      this.tagList = this.filters[`tags`];
      this.filteredAuthors = this.creatorCtrl.valueChanges.pipe(
        // tslint:disable-next-line:deprecation
        startWith(null),
        map((creator: string | null) => creator ? this._filter(creator) : this.authors.slice()));
    });
    /**
     * Definition of the filter of the calendar to display what  dates can  be selected
     * @param d date to check
     */
    this.dateFilter = (d: Date | null): boolean => {
      if (!this.yearSelected) {
        if (this.falseYears.includes(d.getFullYear())) {
          return false;
        } else {
          if (this.table.dataSource.data.some(e => {
            return e[this.picker.selected].includes(d.getFullYear().toString());
          })) {
            return true;
          } else {
            this.falseYears.push(d.getFullYear());
            return false;
          }
        }
      }
      if (!this.monthSelected) {
        if (this.falseMonths.includes(d.getMonth().toString() + d.getFullYear().toString())) {
          return false;
        } else {
          let date;
          date = d.getFullYear().toString() + '-';
          if (d.getMonth() + 1 < 10) {
            date = date + '0';
          }
          date = date + (d.getMonth() + 1).toString();
          if (this.table.dataSource.data.some(e => {
            return e[this.picker.selected].includes(date);
          })) {
            return true;
          } else {
            this.falseMonths.push(d.getMonth().toString() + d.getFullYear().toString());
            return false;
          }
        }
      }
      return this.table.dataSource.data.some(e => {
        return e[this.picker.selected] === this.datePipe.transform(d, 'yyyy-MM-dd');
      });
    };
  }

  /**
   * Check that the value selected in the calendar is not null and then format it
   * @param event - date selected in the calendar
   */
  checkEvent(event: MatDatepickerInputEvent<any>) {
    if (event.value !== null) {
      event.value = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    } else {
      event.value = '';
    }
  }

  /**
   * Removes creator from the selected options and add it back to the possible options
   * @param author - author to remove from the selected options
   */
  remove(author: string): void {
    const index = this.selectedAuthors.indexOf(author);

    if (index >= 0) {
      this.authors.push(this.selectedAuthors[index]);
      this.selectedAuthors.splice(index, 1);
    }
    this.creatorInput.nativeElement.value = '';
    this.creatorCtrl.setValue(null);
  }

  /**
   * Add the author to the selected options and remove it from the possible options to select
   * @param event author to be added
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.authors.indexOf(event.option.viewValue);
    this.authors.splice(index, 1);
    this.selectedAuthors.push(event.option.viewValue);
    this.creatorInput.nativeElement.value = '';
    this.creatorCtrl.setValue(null);
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      // @ts-ignore
      this.search.search.setValue(params.search);
      this.table.searchFilter(params.search);
    });
    this.table[`subscription`].add(() => {
      this.formControl.enable();
      this.creatorCtrl.enable();
      this.date1.enable();
      this.date2.enable();
    });
  }

  datesChecked() {
    this.yearSelected = false;
    this.monthSelected = false;
    this.falseYears = [];
    this.falseMonths = [];
  }

  datePicker() {
    this.picker.selected = 'creationDate';
  }
  datePicker1() {
    this.picker.selected = 'incidentDate';
  }

  resetFilters() {
    this.formControl.reset();
    this.creatorCtrl.reset();
    this.selectedAuthors.forEach(author => {
      this.remove(author);
    });
    this.date1.reset();
    this.date2.reset();
    this.table.filterSelection.clear();
    this.table.applyFilter();
  }

  /**
   * filter for the autocomplete of the authors field
   * @param value author to filter
   *
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.authors.filter(creator => creator.toLowerCase().indexOf(filterValue) === 0);
  }
}
