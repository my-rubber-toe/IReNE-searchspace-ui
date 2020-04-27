import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { GoogleChartComponent, ChartEvent } from 'angular-google-charts';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';
import { DocumentMetadata } from 'src/app/shared/models/searchspace.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { FilterService } from 'src/app/shared/services/filter.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';



interface SearchValues {
  publicationDate: string;
  incidentDate: string;
  infras: string;
  damage: string;
  tags: string;
  language: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    private filterService: FilterService,
    private datePipe: DatePipe,
    private searchSpaceService: SearchSpaceService,
    private router: Router,
    private snackBar: MatSnackBar
    ) {}

  @ViewChild('map')
  map: GoogleChartComponent;

  @ViewChild('inputToDate1', {
    read: MatInput
  }) inputToDate1: MatInput;

  @ViewChild('inputToDate2', {
    read: MatInput
  }) inputToDate2: MatInput;

  @ViewChild('someSelect1', {
    read: MatSelect
  }) someSelect1: MatSelect;

  @ViewChild('someSelect2', {
    read: MatSelect
  }) someSelect2: MatSelect;

  @ViewChild('someSelect3', {
    read: MatSelect
  }) someSelect3: MatSelect;

  @ViewChild('someSelect4', {
    read: MatSelect
  }) someSelect4: MatSelect;

  dirtyFields = false;

  documents: DocumentMetadata[];

  tempDate1: Date = null;
  tempDate2: Date = null;


  // Google Map Data Setup
  title = '';
  type = 'Map';
  data = [
    ['Mayaguez, PR', 'Mayaguez, PR', 'Mayaguez, PR'],
    ['Ponce, PR', 'Ponce, PR', 'Ponce, PR'],
    ['Rio Piedras, PR', 'Rio Piedras, PR', 'Rio Piedras, PR']
  ];
  columnNames = ['location', 'title', 'docId'];
  options = {
    showTip: true,
    // enableScrollWheel: true
  };
  width = 1250;
  height = 500;

  /**
   * The available filters that will be used for the data.
   */
  filterSelection: Map<string, any> = new Map<string, any>([
    ['location', ''],
    ['infrasDocList', ''],
    ['damageDocList', ''],
    ['language', ''],
    ['tagsDoc', ''],
    ['incidentDate', ''],
    ['creationDate', '']
  ]);

  todayDate = new Date();

  // Option Forms and Date
  publicationDate = new FormControl(moment(''));
  incidentDate = new FormControl(moment(''));

  infrastructure = new FormControl();
  infrastructureList: string[];

  damage = new FormControl();
  damageList: string[]

  tags = new FormControl();
  tagsList: string[];

  language = new FormControl();
  languageList: string[] = ['English', 'Spanish'];

  /**
   * The data source to be used.
   */
  dataSource: MatTableDataSource<DocumentMetadata>;
  tempDataSource: MatTableDataSource<DocumentMetadata>;

  /**@ignore */
  ngOnInit() {
    const scrollToTop = window.setInterval(() => {
    const pos = window.pageYOffset;
    if (pos > 0) {
        window.scrollTo(0, pos - 30); // how far to scroll on each step
    } else {
        window.clearInterval(scrollToTop);
    }
    }, 16);

    this.searchSpaceService.getDocuments().add(() => {
      this.dataSource =  new MatTableDataSource<DocumentMetadata>(this.searchSpaceService.documents);
      this.tempDataSource = this.dataSource;
    });

    // Retrieve all the available filters in the database.
    this.searchSpaceService.getFilters().add(() => {
      this.infrastructureList = this.searchSpaceService.filters[`infrastructures`];
      this.damageList = this.searchSpaceService.filters[`damages`];
      this.tagsList = this.searchSpaceService.filters[`tags`];
    });
  }

  /**
   * Set the fields to be dirty and disable the button
   */
  setDirty() {
    this.dirtyFields = true;
  }

  /**
   * Update the map with the new values based on the selected search criteria. Marker on the map is treated as a 3 item array
   * [location, title, docId]
   */
  updateMap() {

    this.applyFilter();
    console.log(this.dataSource.data);

    if (this.dataSource.data.length === 0) {
      this.snackBar.open('Total results: 0', null, {
        duration: 3000
      });
      this.data = [];
    } else {
      this.data = [];
      this.dataSource.data.forEach(e => {
        this.data.push([e.location[0], e.title, e._id[`$oid`]]);
        console.log(this.data);
      });
      this.dirtyFields = false;
      this.snackBar.open(`Total results: ${this.data.length}`, null, {
        duration: 3000
      });

     }
  }

  /**
   * Retrieve the information from the selected map marker and redirect the user to the correspoinding document.
   * @param e The event that holds the information of the selected marker in the map.
   */
  markerSelect(e: ChartEvent) {
    if(
      this.data[e[0].row][2] === 'Mayaguez, PR' ||
      this.data[e[0].row][2] === 'Ponce, PR' ||
      this.data[e[0].row][2] === 'Rio Piedras, PR'
    ){
      this.snackBar.open('ERROR: Placeholder data selected.', null, {duration: 3000})

    }else {
      const docId = this.data[e[0].row][2];
      this.router.navigate([`/preview/${docId}`]);
    }
  }

  /**
   * Setup the selection filter based on the selected option.
   * @param selection the array of values from the selected options
   * @param type the type of filter.
   */
  selectionEvent(selection: any, type: string) {
    this.filterSelection.set(type, selection);
    this.dirtyFields = true;
    console.log(this.filterSelection);
  }

  ///////////////////// HELPERS//////////////////////////////////////


  /**
   * Applies the filter on the data based on the selected filters. Use MatTableDataSource for easier filtering operations.
   */
  applyFilter() {
    this.dataSource = this.filterService.applyFilter(this.filterSelection, this.tempDataSource);
  }

  /**
   * Converts the selected date from Date object to string with format YYYY-MM-DD.
   *
   * @param event the event Object when the date picker changes value.
   */
  datePreCheck(event: MatDatepickerInputEvent<any>) {
    event.value = this.datePipe.transform(event.value, 'yyyy-MM-dd');
  }

  /**
   * Reset the filter values.
   */
    resetFilters(){
    this.filterSelection = new Map<string, any>([
      ['location', ''],
      ['infrasDocList', ''],
      ['damageDocList', ''],
      ['language', ''],
      ['tagsDoc', ''],
      ['incidentDate', ''],
      ['creationDate', '']
    ]);

    this.inputToDate1.value = '';
    this.inputToDate2.value = '';
    this.someSelect1.value = null;
    this.someSelect2.value = null;
    this.someSelect3.value = null;
    this.someSelect4.value = null;

    this.incidentDate.clearValidators();
    this.publicationDate.clearValidators();
    this.dirtyFields = false;
    this.applyFilter();
  }

  /**
   * Retrieve all available markers and reset filters.
   */
  getAll(){
    if(this.data.length < this.dataSource.data.length){
      this.resetFilters();
      this.dataSource =  new MatTableDataSource<DocumentMetadata>(this.searchSpaceService.documents);
      this.tempDataSource = this.dataSource;
      this.dirtyFields = false;
      this.updateMap();
    }else{
      this.snackBar.open('All items are being displayed.',null,{duration: 3000})
    }
  }
}
