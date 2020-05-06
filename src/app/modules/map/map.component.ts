import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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

declare const OverlappingMarkerSpiderfier;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit, AfterViewInit {
  publicationFilter;
  incidentFilter;

  constructor(
    private filterService: FilterService,
    private datePipe: DatePipe,
    private searchSpaceService: SearchSpaceService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

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

  documents: MapMetadata[];

  // Google Map Data Setup
  title = '';
  gmap;
  type = 'Map';
  center: google.maps.LatLngLiteral;
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
  oms;
  headerComponent = DateHeaderComponent;

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
  publicationDate = new FormControl('');
  incidentDate = new FormControl('');

  infrastructure = new FormControl();
  infrastructureList: string[];

  damage = new FormControl();
  damageList: string[];

  tags = new FormControl();
  tagsList: string[];

  language = new FormControl();
  languageList: string[] = ['English', 'Spanish'];

  /**
   * The data source to be used.
   */
  dataSource: MatTableDataSource<MapMetadata>;
  tempDataSource: MatTableDataSource<MapMetadata>;
  private markerCluster: MarkerClusterer;
  private falseYears = [];
  yearSelected = false;
  private falseMonths = [];
  monthSelected = false;

  // tslint:disable-next-line:jsdoc-format
  /**@ignore */
  ngOnInit() {
    this.searchSpaceService.getMapDocuments().add(() => {
      this.dataSource = new MatTableDataSource<MapMetadata>(this.searchSpaceService.map);
      this.tempDataSource = this.dataSource;
      this.loadMap();
    });

    // Retrieve all the available filters in the database.
    this.searchSpaceService.getFilters().add(() => {
      this.infrastructureList = this.searchSpaceService.filters[`infrastructures`];
      this.damageList = this.searchSpaceService.filters[`damages`];
      this.tagsList = this.searchSpaceService.filters[`tags`];
    });
    this.center = {
      lat: 18.2208328,
      lng: -66.5901489,
    };
    /*
    * Definition of the filter of the calendar to display what  dates can  be selected
    * @param d date to check
    */
    this.publicationFilter = (d: Date | null): boolean => {
      if (!this.yearSelected) {
        if (this.falseYears.includes(d.getFullYear())) {
          return false;
        } else {
          if (this.dataSource.data.some(e => {
            return e.creationDate.includes(d.getFullYear().toString());
          })) {
            return true;
          } else {
            this.falseYears.push(d.getFullYear());
            return false;
          }
        }
      }
      if (this.yearSelected && !this.monthSelected) {
        if (this.falseMonths.includes(d.getMonth())) {
          return false;
        } else {
          let date;
          if (d.getMonth() + 1 < 10) {
            date = d.getFullYear().toString() + '-' + '0' + (d.getMonth() + 1).toString();
          } else {
            date = d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString();
          }
          if (this.dataSource.data.some(e => {
            return e.creationDate.includes(date);
          })) {
            return true;
          } else {
            this.falseMonths.push(d.getMonth());
            return false;
          }
        }
      }
      return this.dataSource.data.some(e => {
        return e.creationDate === this.datePipe.transform(d, 'yyyy-MM-dd');
      });
    };
    /**
     * Definition of the filter of the calendar to display what  dates can  be selected
     * @param d date to check
     */
    this.incidentFilter = (d: Date | null): boolean => {
      if (!this.yearSelected) {
        if (this.falseYears.includes(d.getFullYear())) {
          return false;
        } else {
          if (this.dataSource.data.some(e => {
            return e.incidentDate.includes(d.getFullYear().toString());
          })) {
            return true;
          } else {
            this.falseYears.push(d.getFullYear());
            return false;
          }
        }
      }
      if (this.yearSelected && !this.monthSelected) {
        if (this.falseMonths.includes(d.getMonth())) {
          return false;
        } else {
          let date;
          if (d.getMonth() + 1 < 10) {
            date = d.getFullYear().toString() + '-' + '0' + (d.getMonth() + 1).toString();
          } else {
            date = d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString();
          }
          if (this.dataSource.data.some(e => {
            return e.incidentDate.includes(date);
          })) {
            return true;
          } else {
            this.falseMonths.push(d.getMonth());
            return false;
          }
        }
      }
      return this.dataSource.data.some(e => {
        return e.incidentDate === this.datePipe.transform(d, 'yyyy-MM-dd');
      });
    };
  }

  ngAfterViewInit(): void {
  }

  loadMap() {
    const mapElement = document.getElementById('map-element');
    this.gmap = new google.maps.Map(mapElement, this.mapOptions);
    this.oms = new OverlappingMarkerSpiderfier(this.gmap, {
      markersWontMove: true,
      markersWontHide: true,
      basicFormatEvents: true,
      nearbyDistance: 5,
      circleSpiralSwitchover: Infinity,
      circleFootSeparation: 50,
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
  }

  automaticSpiderify(c) {
    google.maps.event.addListenerOnce(this.gmap, 'tilesloaded', () => {
      if (this.gmap.getZoom() >= 16 && this.oms.markersNearMarker(c[0], true).length === 1) {
        google.maps.event.trigger(c[0], 'click');
      }
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
   * Set the dirty to false,  so the user need to change a value in the filters to press update button again.
   * [location, title, docId]
   */
  updateMap() {
    this.dirtyFields = false;
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
    this.dirtyFields = true;
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
    this.dirtyFields = false;
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
      this.dirtyFields = false;
      this.updateMap();
    } else {
      this.snackBar.open('All items are being displayed.', null, {duration: 3000});
    }
  }

  datesChecked() {
    this.yearSelected = false;
    this.monthSelected = false;
    this.falseYears = [];
    this.falseMonths = [];
  }
}
