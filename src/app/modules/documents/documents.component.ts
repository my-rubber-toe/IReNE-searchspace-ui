import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import {SearchSpaceService} from '../../shared/services/searchspace.service';
import {Filters} from '../../shared/models/searchspace.model';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {DocumentsTableComponent} from './documents-table/documents-table.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [
  ],
})
export class DocumentsComponent implements OnInit {
  @Output() sendChange = new EventEmitter();
  @Output() selectedEvent = new EventEmitter();
  @ViewChild('creatorInput') creatorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('documentsTableComponent') table: DocumentsTableComponent;
  date1 = new FormControl('');
  date2 = new FormControl('');
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
    private filtersService: SearchSpaceService,
    private datePipe: DatePipe
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
    this.publicationFilter = (d: Date | null): boolean => {
      return this.table.dataSource.data.some(e => {
        return e.creationDate === this.datePipe.transform(d, 'yyyy-MM-dd');
      });
    };
    /**
     * Definition of the filter of the calendar to display what  dates can  be selected
     * @param d date to check
     */
    this.incidentFilter = (d: Date | null): boolean => {
      return this.table.dataSource.data.some(e => {
        return e.incidentDate === this.datePipe.transform(d, 'yyyy-MM-dd');
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
