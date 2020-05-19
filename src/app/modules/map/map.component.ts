/*
  Author: Alejandro Vasquez Nuñez <alejandro.vasquez@upr.edu>
*/
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {SearchSpaceService} from 'src/app/shared/services/searchspace.service';
import {MapMetadata} from 'src/app/shared/models/searchspace.model';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {FilterService} from 'src/app/shared/services/filter.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import MarkerClusterer from '@google/markerclustererplus';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {DateHeaderComponent} from '../documents/date-header.component';

/**
 * For use in the spiderfy
 */
declare const OverlappingMarkerSpiderfier;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit {

  /**
   * To control the date1 input child in HTML
   */
  @ViewChild('inputToDate1', {
    read: MatInput
  }) inputToDate1: MatInput;
  /**
   * To control the date2 input child in HTML
   */
  @ViewChild('inputToDate2', {
    read: MatInput
  }) inputToDate2: MatInput;
  /**
   * To control the mat-select1 input child in HTML
   */
  @ViewChild('someSelect1', {
    read: MatSelect
  }) someSelect1: MatSelect;
  /**
   * To control the mat-select2 input child in HTML
   */
  @ViewChild('someSelect2', {
    read: MatSelect
  }) someSelect2: MatSelect;
  /**
   * To control the mat-select3 input child in HTML
   */
  @ViewChild('someSelect3', {
    read: MatSelect
  }) someSelect3: MatSelect;
  /**
   * To control the mat-select4 input child in HTML
   */
  @ViewChild('someSelect4', {
    read: MatSelect
  }) someSelect4: MatSelect;
  /**
   * Interface to use in the documents(See models documentation)
   */
  documents: MapMetadata[];
  ///////// Settings for Google Maps ///////////////
  /**
   * @ignore
   */
  title = '';
  /**
   * Google Maps
   */
  gmap;
  /**
   * @ignore
   */
  type = 'Map';
  /**
   * @ignore
   */
  center: google.maps.LatLngLiteral;
  /**
   * @ignore
   */
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    mapTypeControl: true,
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    streetViewControl: false,
    minZoom: 9,
    zoom: 9,
    center: {
      lat: 18.2208328,
      lng: -66.5901489
    }
  };
  /**
   * Overlapping Marker Spiderfier
   */
  oms;
  /**
   * Custom component of the DatePicker header using the material picker sourcecode to maintain the material design, but with
   *
   * custom functions and disabled buttons for better handling of the current view
   */
  headerComponent = DateHeaderComponent;
  /**
   * Map of the categories to filter and what values to use as filters
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
  /**
   * Create today's date for to set the max date in the datepickers
   */
  todayDate = new Date();
  /**
   * Date controller for Publication Date input
   */
  publicationDate = new FormControl({value: '', disabled: true});
  /**
   * Date controller for Incident Date input
   */
  incidentDate = new FormControl({value: '', disabled: true});
  /**
   * Control of the inputs of infrastructure  filter
   */
  infrastructure = new FormControl({value: '', disabled: true});
  /**
   * Array to save options of the Structure filter
   */
  infrastructureList: string[];
  /**
   * Control of the inputs of damage filter
   */
  damage = new FormControl({value: '', disabled: true});
  /**
   * Array to save options of the Damages filter
   */
  damageList: string[];
  /**
   * Control of the inputs of tags filter
   */
  tags = new FormControl({value: '', disabled: true});
  /**
   * Array to save options of the Tags filter
   */
  tagsList: string[];
  /**
   * Control of the inputs of language filter
   */
  language = new FormControl({value: '', disabled: true});
  /**
   * Option for the language filter
   */
  languageList: string[] = ['English', 'Spanish'];
  /**
   * The data source to be used.
   */
  dataSource: MatTableDataSource<MapMetadata>;
  /**
   * Save the original Data Source values for recovery
   */
  tempDataSource: MatTableDataSource<MapMetadata>;
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
   * @ignore
   */
  dateFilter;
  /**
   * Boolean variable to know when the documents and the map finished loading and stop displaying the spinner
   */
  loading = true;
  /**
   * Marker Cluster
   */
  private markerCluster: MarkerClusterer;
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
    private filterService: FilterService,
    private datePipe: DatePipe,
    private searchSpaceService: SearchSpaceService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  /**
   * Get  the documents and calls loadmap() to start loading the map.
   *
   * Also get the options to use in the filters selection
   */
  ngOnInit() {
    this.searchSpaceService.getMapDocuments().add(() => {
      this.dataSource = new MatTableDataSource<MapMetadata>(this.searchSpaceService.map);
      this.tempDataSource = this.dataSource;
      this.loadMap();
    });
    this.searchSpaceService.getFilters().add(() => {
      this.infrastructureList = this.searchSpaceService.filters[`infrastructures`];
      this.damageList = this.searchSpaceService.filters[`damages`];
      this.tagsList = this.searchSpaceService.filters[`tags`];
    });
    // sets the map center to Puerto Rico
    this.center = {
      lat: 18.2208328,
      lng: -66.5901489,
    };
    /*
    * Definition of the filter of the calendar to display what  dates can  be selected
    * @param d date to check
    */
    this.dateFilter = (d: Date | null): boolean => {
      if (!this.yearSelected) {
        if (this.falseYears.includes(d.getFullYear())) {
          return false;
        } else {
          if (this.dataSource.data.some(e => {
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
          if (this.dataSource.data.some(e => {
            return e[this.picker.selected].includes(date);
          })) {
            return true;
          } else {
            this.falseMonths.push(d.getMonth().toString() + d.getFullYear().toString());
            return false;
          }
        }
      }
      return this.dataSource.data.some(e => {
        return e[this.picker.selected] === this.datePipe.transform(d, 'yyyy-MM-dd');
      });
    };
  }

  /**
   * Load the map and create an instance of it and map it to the HTML element with id map-element, also create initialize the marker
   *
   * spiderfy and cluster API . Add listeners to the marker, so when clicked redirect the user to read the document.
   */
  loadMap() {
    const mapElement = document.getElementById('map-element');
    this.gmap = new google.maps.Map(mapElement, this.mapOptions);
    this.oms = new OverlappingMarkerSpiderfier(this.gmap, {
      markersWontMove: true,
      markersWontHide: true,
      basicFormatEvents: true,
      nearbyDistance: 5,
      circleSpiralSwitchover: Infinity,
      circleFootSeparation: 25,
    });
    this.oms.addListener('click', (marker) => {
      this.markerSelect(marker.desc);
    });
    // tslint:disable-next-line:no-unused-expression
    this.markerCluster = new MarkerClusterer(this.gmap, null,
      {imagePath: 'assets/pictures/m/m', maxZoom: 15}
    );
    google.maps.event.addListenerOnce(this.gmap, 'idle', () => {
      // map is ready
      this.updateMap();
    });
    this.tags.enable();
    this.damage.enable();
    this.infrastructure.enable();
    this.publicationDate.enable();
    this.incidentDate.enable();
    this.language.enable();
    this.loading = false;
  }

  /**
   * Add a listener to the clusters to expand the inside spiderfy when clicked and the cluster do a zoom to a level 16 or more,
   *
   * and the map finished loading the tiles
   * @param c - cluster to add the listener
   */
  automaticSpiderify(c) {
    google.maps.event.addListenerOnce(this.gmap, 'tilesloaded', () => {
      if (this.gmap.getZoom() >= 16 && this.oms.markersNearMarker(c[0], true).length === 1) {
        google.maps.event.trigger(c[0], 'click');
      }
    });
  }

  /**
   * Update the map with the new values based on the selected search criteria. Marker on the map is treated as a 3 item array
   * [location, title, docId]
   */
  updateMap() {
    this.applyFilter();
    google.maps.event.clearListeners(this.markerCluster, 'click');
    this.oms.removeAllMarkers();
    this.markerCluster.clearMarkers();
    if (this.dataSource.data.length !== 0) {
      for (const e of this.dataSource.data) {
        for (const loc of e.location) {
          if (loc.latitude && loc.longitude) {
            const marker = new google.maps.Marker({
                position: {
                  lat: loc.latitude,
                  lng: loc.longitude,
                },
                title: e.title,
              },
            );
            // @ts-ignore
            marker.desc = e._id[`$oid`];
            this.oms.addMarker(marker);
            this.markerCluster.addMarker(marker);
          }
        }
      }
      google.maps.event.addListener(this.markerCluster, 'click', (c) => {
        this.automaticSpiderify(c.getMarkers());
      });
      this.gmap.setZoom(this.mapOptions.zoom);
      this.gmap.setCenter(this.mapOptions.center);
    } else {
      this.snackBar.open('Not found matching results', null, {
        duration: 3000
      });
    }
  }

  /**
   * Retrieve the information from the selected map marker and redirect the user to the corresponding document.
   * @param label - label including the id
   */
  markerSelect(label: string) {
    this.router.navigate([`/preview/${label}`]);
  }

  /**
   * Setup the selection filter based on the selected option.
   * @param selection the array of values from the selected options
   * @param type the type of filter.
   */
  selectionEvent(selection: any, type: string) {
    this.filterSelection.set(type, selection);
  }


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
    if (event.value !== null) {
      event.value = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    } else {
      event.value = '';
    }
  }

  /**
   * Reset the filter values.
   */
  resetFilters() {
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
    this.applyFilter();
    this.oms.removeAllMarkers();
    this.markerCluster.clearMarkers();
  }

  /**
   * Retrieve all available markers and reset filters.
   */
  getAll() {
    if (this.dataSource.data.length < this.tempDataSource.data.length || this.oms.getMarkers().length === 0) {
      this.resetFilters();
      this.dataSource.data = this.tempDataSource.data;
      this.updateMap();
    } else {
      this.snackBar.open('All items are being displayed.', null, {duration: 3000});
    }
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
  datePicker2() {
    this.picker.selected = 'incidentDate';
  }
}
