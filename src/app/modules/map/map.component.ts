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
    private router: Router
    ) {}

  @ViewChild('map')
  map: GoogleChartComponent;

  dirtyFields = false;

  documents: DocumentMetadata[];

  tempEvent: Event;

  // Google Map Data Setup
  title = '';
  type = 'Map';
  data = [];
  columnNames = ['location', 'title', 'docId'];
  options = {
    showTip: true,
    enableScrollWheel: true
  };
  width = 1250;
  height = 600;

  // The available filters that will be used for the data
  filterSelection: Map<string, any> = new Map<string, any>([
    ['location', ''],
    ['infrastructure_type', ''],
    ['damage_type', ''],
    ['language', ''],
    ['tag', ''],
    ['incident_date', ''],
    ['publication_date', '']
  ]);

  todayDate = new Date();

  // Option Forms and Date
  publicationDate = new FormControl(moment(''));
  incidentDate = new FormControl(moment(''));

  infrastructure = new FormControl();
  infrastructureList: string[] = ['Building', 'Bridge'];

  damage = new FormControl();
  damageList: string[] = ['Flooding', 'Fire', 'Broken Sewer'];

  tags = new FormControl();
  tagsList: string[] = ['Flood', 'Hurricane', 'Earthquake'];

  language = new FormControl();
  languageList: string[] = ['English', 'Spanish'];

  // The data source for the documents
  dataSource: MatTableDataSource<DocumentMetadata>;
  tempDataSource: MatTableDataSource<DocumentMetadata>;

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
    console.log(this.dataSource.data.length);
     
    if (this.dataSource.data.length === 0) {
      throw Error('Filter did not yield results.')
    } else {
      // this.data = [];
      // this.dataSource.data.forEach(e => {
      //   this.data.push([e.location, e.title, e.id])  ;
      // });
      // this.dirtyFields = false;
     }
  }

  /**
   * Retrieve the information from the selected map marker and redirect the user to the correspoinding document.
   * @param e The event that holds the information of the selected marker in the map.
   */
  markerSelect(e: ChartEvent) {
    const docId = this.data[e[0].row][2];
    this.router.navigate([`/preview/${docId}`]);
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
   * Converts the selected date from Date object to sting with format YYYY-MM-DD.
   *
   * @param event the event when the date picker is used.
   */
  datePreCheck(event: MatDatepickerInputEvent<any>) {
    if (event.value !== null) {
      event.value = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    } else {
      event.value = '';
    }
  }
}
