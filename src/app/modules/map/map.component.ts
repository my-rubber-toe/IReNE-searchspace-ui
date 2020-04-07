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



interface SearchValues {
  publicationDate: string;
  incidentDate: string;
  infras: string;
  damage: string;
  tags: string;
  language:string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild('map')
  map: GoogleChartComponent;

  dirtyFields = false;

  documents: DocumentMetadata[]

  // Google Map Data Setup
  title = '';
  type = 'Map';
  data = [
    ["Fajardo, PR", "title", "1"],
    ["Rincon, PR","title", "2"],
    ["Arecibo, PR","title", "3"],
    ["Ponce, PR","title", "4"]
  ];
  columnNames = ["location","title", "docId"];
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
  damageList: string[] = ['Flooding','Fire','Broken Sewer'];

  tags = new FormControl();
  tagsList: string[] = ['Flood', 'Huracaine', 'Earthquake'];

  language = new FormControl();
  languageList: string[] = ['English', 'Spanish'];

  // Search Values
  searchValues: SearchValues;

  // The data source for the documents
  dataSource: MatTableDataSource<DocumentMetadata>;
  tempDataSource: MatTableDataSource<DocumentMetadata>;


  constructor(
    private datePipe: DatePipe,
    private searchSpaceService: SearchSpaceService
    ){}

  ngOnInit(){
    let scrollToTop = window.setInterval(() => {
    let pos = window.pageYOffset;
    if (pos > 0) {
        window.scrollTo(0, pos - 30); // how far to scroll on each step
    } else {
        window.clearInterval(scrollToTop);
    }
    }, 16);

    this.searchSpaceService.getDocuments().add(() => {
      this.dataSource =  new MatTableDataSource<DocumentMetadata>(this.searchSpaceService.documents);
      this.tempDataSource = this.dataSource;
      this.updateMap()
    });
  }

  /**
   * Set the fields to be dirty and disable the button
   */
  setDirty(){
    this.dirtyFields = true;
  }

  /**
   * Update the map with the new values based on the selected search criteria. Marker on the map is treated as a 3 item array
   * [location, title, docId]
   */
  updateMap(){
    if(this.dataSource.data === []){
      alert('Filter did not yield any data.')
    }else {
      this.data = []
      this.dataSource.data.forEach(e => {
        this.data.push([e.location, e.title, e.id])
      });
      this.dirtyFields = false;
    }
  }

  /**
   * Retrieve the information from the selected map marker.
   * @param e The event that holds the information of the selected marker in the map.
   */
  markerSelect(e: ChartEvent) {
    console.log(this.data[e[0].row][2])
    console.log(this.infrastructure.value)
  }

  /**
   * Setup the selection filter based on the selected option.
   * @param selection the array of values from the selected options
   * @param type the type of filter.
   */
  selectionEvent(selection: any, type: string) {
    if (selection.length === 0) {
      this.dataSource = this.tempDataSource;
    }
    this.filterSelection.set(type, selection);
    this.applyFilter()
    this.setDirty()
    console.log(this.data)
  }

  /////////////////////HELPERS//////////////////////////////////////

  
  /**
   * Applies the filter on the data based on the selected filters. Use MatTableDataSource for easier filtering operations.
   */
  applyFilter() {
    const filteringDataSource = new MatTableDataSource<DocumentMetadata>();
    this.filterByLanguage(this.filterSelection.get('language'), filteringDataSource);
    this.filterBySelection(this.filterSelection.get('tag'), filteringDataSource, 'tag');
    this.filterBySelection(this.filterSelection.get('damage_type'), filteringDataSource, 'damage_type');
    this.filterBySelection(this.filterSelection.get('infrastructure_type'), filteringDataSource, 'infrastructure_type');
    this.filterBySelection(this.filterSelection.get('publication_date'), filteringDataSource, 'publication_date');
    this.filterBySelection(this.filterSelection.get('incident_date'), filteringDataSource, 'incident_date');
    this.dataSource = filteringDataSource;
  }

  /**
   * Filters the given data source by the selected languages.
   * 
   * @param language the selected language values
   * @param filteringDataSource the filtered data source
   */
  filterByLanguage(language: string[], filteringDataSource: MatTableDataSource<DocumentMetadata>) {
    if (language.length !== 0) {
      this.tempDataSource.data.forEach(e => {
        language.forEach(s => {
          if (e.language === s) {
            filteringDataSource.data.push(e);
          }
        });
      });
    } else {
      filteringDataSource.data = this.tempDataSource.data;
    }
  }

  /**
   * 
   * @param filter the values of the given filter
   * @param filteringDataSource the datasource to filter from
   * @param selection the filter field
   */
  filterBySelection(filter: string[], filteringDataSource: MatTableDataSource<DocumentMetadata>, selection: string) {
    const tempFilterData = new MatTableDataSource<DocumentMetadata>();
    if (filter.length !== 0 || selection === 'language') {
      switch (selection) {
        case 'damage_type':
          filteringDataSource.data.forEach(e => {
            for (const value of filter) {
              if (e.damage_type.includes(value)) {
                tempFilterData.data.push(e);
                break;
              }
            }
          });
          break;
        case 'infrastructure_type':
          filteringDataSource.data.forEach(e => {
            for (const value of filter) {
              if (e.infrastructure_type.includes(value)) {
                tempFilterData.data.push(e);
                break;
              }
            }
          });
          break;
        case 'tag':
          filteringDataSource.data.forEach(e => {
            for (const value of filter) {
              if (e.tag.includes(value)) {
                tempFilterData.data.push(e);
                break;
              }
            }
          });
          break;
        case 'publication_date':
          filteringDataSource.data.forEach(e => {
              if (e.publication_date.includes(filter.toString())) {
                tempFilterData.data.push(e);
              }
          });
          break;
        case 'incident_date':
          filteringDataSource.data.forEach(e => {
            if (e.incident_date.includes(filter.toString())) {
              tempFilterData.data.push(e);
            }
          });
          break;
        case 'creators':
          filteringDataSource.data.forEach(e => {
            for (const value of filter) {
              if (e.creator.includes(value)) {
                tempFilterData.data.push(e);
                break;
              }
            }
          });
          break;
      }
      filteringDataSource.data = tempFilterData.data;
    }
  }

  checkEvent(event: MatDatepickerInputEvent<any>) {
    if (event.value !== null) {
      event.value = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    } else {
      event.value = '';
    }
  }

}
