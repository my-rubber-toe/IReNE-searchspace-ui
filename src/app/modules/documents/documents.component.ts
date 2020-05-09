import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import {SearchSpaceService} from '../../shared/services/searchspace.service';
import {Filters} from '../../shared/models/searchspace.model';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
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
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentsComponent implements OnInit, AfterViewInit {
  /**
   * To control the creator input child in HTML
   */
  @ViewChild('creatorInput') creatorInput: ElementRef<HTMLInputElement>;
  /**
   * To control the events of the Search Component
   */
  @ViewChild('searchComponent') search: SearchComponent;
  /**
   * Autocomplete control
   */
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  /**
   * To manipulate and use the variables of DocumentTableComponent
   */
  @ViewChild('documentsTableComponent') table: DocumentsTableComponent;
  /**
   * Date controllers for Publication Date input
   */
  date1 = new FormControl({value: '', disabled: true});
  /**
   * Date controllers for Incident Date input
   */
  date2 = new FormControl({value: '', disabled: true});
  /**
   * Max date to use in the datepickers
   */
  maxDate: Date;
  /**
   * Min date to use in the datepickers
   */
  minDate: Date = new Date(1970, 0, 1);
  /**
   * Value to know if a author is selectable and present it in the possible options in HTML
   */
  selectable = true;
  /**
   * Value to know if a author is removable  of the selected options
   */
  removable = true;
  /**
   * @ignore
   */
  separatorKeysCodes: number[] = [ENTER, COMMA];
  /**
   * Array to store possible authors options
   */
  authors: string[];
  /**
   * Array to save the selected authors to filter
   */
  selectedAuthors: string[] = [];
  /**
   * Filtered options when the user starts to write the name of the author
   */
  filteredAuthors: Observable<string[]>;
  /**
   * Array of the Interface Filters(See Documentation for models) that save the options for the different categories of filters
   */
  filters: Filters[];
  /**
   * Control of the inputs of filters
   */
  formControl = new FormControl({value: '', disabled: true});
  /**
   * Control for the authors filter input
   */
  creatorCtrl = new FormControl({value: '', disabled: true});
  /**
   * Option for the language filter
   */
  languageList: string[] = ['English', 'Spanish'];
  /**
   * Array to save options of the Structure filter
   */
  structureList: string[];
  /**
   * Array to save options of the Damages filter
   */
  dmgList: string[];
  /**
   * Array to save options of the Tags filter
   */
  tagList: string[];
  /**
   * @ignore
   */
  dateFilter;
  /**
   * Boolean to know if the user selected the year view in the datepickers, this helps to improve filtering. Only the possibles months
   *
   * will be filtered
   */
  yearSelected = false;
  /**
   * Boolean to know if the user selected the month view in the datepickers, this helps to improve filtering. Only the possibles days
   *
   * will be filtered
   */
  monthSelected = false;
  /**
   * Custom component of the DatePicker header using the material picker sourcecode to maintain the material design, but with
   *
   * custom functions and disabled buttons for better handling of the current view
   */
  dateHeaderComponent = DateHeaderComponent;
  /**
   * Array to save the years that have are not present in any document to improve speed of the dates filtering.
   *
   * If a year of a date is not present in any documents, that year will be added to this array and will be lookup first to not search
   * all documents again.
   */
  private falseYears = [];
  /**
   * Array to save the months with year that have are not present in any document to improve speed of the dates filtering.
   *
   * If a month and year of a date is not present in any documents, that year will be added to this array and will be lookup first to not
   *
   * search all documents again.
   */
  private falseMonths = [];
  /**
   * To set the value of the picker for date filtering.
   */
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
        map((creator: string | null) => creator ? this._filter(creator) : this.authors.slice()));
    });
    /**
     * Definition of the filter of the calendar to display what  dates can  be selected.
     *
     * If no years is selected the filter will be based on the year of the date.
     *
     * If a year is selected the filter will be based on month asd year of the date.
     *
     * If month and year is selected the filter will be based on the day of the date.
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
   * Check that the value selected in the calendar is not null and then format it to use on the filter
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
   * Removes author from the selected options and add it back to the possible options
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

  /**
   * Receives the query parameters from home to filter the table when the search initiate  on Home view.
   * Use the subscription in the table component to know when the documents finished loading and enable the filter selections.
   */
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

  /**
   * Function when the datepickers close to reset the values of the filtered dates
   */
  datesChecked() {
    this.yearSelected = false;
    this.monthSelected = false;
    this.falseYears = [];
    this.falseMonths = [];
  }

  /**
   * Called from the Publication Date picker to indicate that the dates to filter for selection are the creation dates.
   */
  datePicker() {
    this.picker.selected = 'creationDate';
  }

  /**
   * Called from the Incident Date picker to indicate that the dates to filter for selection are the incident dates.
   */
  datePicker1() {
    this.picker.selected = 'incidentDate';
  }

  /**
   * Reset all the filter selections
   */
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
   * Filter for the autocomplete of the authors field
   * @param value author to filter
   *
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.authors.filter(creator => creator.toLowerCase().indexOf(filterValue) === 0);
  }
}
