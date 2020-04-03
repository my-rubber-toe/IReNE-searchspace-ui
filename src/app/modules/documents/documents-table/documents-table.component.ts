import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { DocumentsService } from '../../../shared/services/documents.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DocumentMetadata} from '../../../shared/Models/searchspace.model';

@Component({
  selector: 'app-documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.css']
})

export class DocumentsTableComponent implements OnInit {
  @Input() show: boolean;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  tempEvent: Event;
  dataSource: MatTableDataSource<DocumentMetadata>;
  tempDataSource: MatTableDataSource<DocumentMetadata>;
  displayedColumns: string[] = ['title', 'creator', 'location',
    'publication_date', 'incident_date', 'modification_date', 'infrastructure_type',
    'damage_type', 'language'];
  filterSelection: Map<string, any> = new Map<string, any>([
    ['location', ''],
    ['infrastructure_type', ''],
    ['damage_type', ''],
    ['language', ''],
  ]);

  applyFilter() {
    const filteringDataSource = new MatTableDataSource<DocumentMetadata>();
    this.filterByLocations(this.filterSelection.get('location'), filteringDataSource);
    this.filterBySelection(this.filterSelection.get('language'), filteringDataSource, 'language');
    this.filterBySelection(this.filterSelection.get('damage_type'), filteringDataSource, 'damage');
    this.dataSource = filteringDataSource;
    if (this.tempEvent) {
      this.searchFilter(this.tempEvent);
    }
    this.paginateSort(this.dataSource);
  }

  searchFilter(event: Event) {
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.tempEvent = event;
      if (filterValue === '') {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      } else {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
    }
    }

  paginateSort(table: MatTableDataSource<DocumentMetadata>) {
    table.sort = this.sort;
    table.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor(
    private documentService: DocumentsService
    ) {
  }

  ngOnInit(): void {
    this.documentService.getDocuments().add(() => {
      this.dataSource =  new MatTableDataSource<DocumentMetadata>(this.documentService.documents);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate =
        (data: DocumentMetadata, filters: string, ) => {
          const matchFilter = [];
          const filterArray = filters.split(' ');
          const columns = ( Object as any).values(data);
          filterArray.forEach(filter => {
            const customFilter = [];
            columns.forEach(column => customFilter.push(column.toString().toLowerCase().includes(filter)));
            matchFilter.push(customFilter.some(Boolean)); // OR
          });
          return matchFilter.every(Boolean); // AND
        };
      this.tempDataSource = this.dataSource;
    });
  }
  filterBySelection(filter: string[], filteringDataSource: MatTableDataSource<DocumentMetadata>, selection: string) {
    const tempFilterData = new MatTableDataSource<DocumentMetadata>();
    if (filter.length !== 0) {
      switch (selection) {
        case 'language':
          filteringDataSource.data.forEach(e => {
            if (filter.includes(e.language)) {
              tempFilterData.data.push(e);
            }
          });
          break;
        case 'damage':
          filteringDataSource.data.forEach(e => {
            for (const value of filter) {
              console.log(value);
              if (e.damage_type.includes(value)) {
                tempFilterData.data.push(e);
                break;
              }
            }
          });
      }
      filteringDataSource.data = tempFilterData.data;
    }
  }

  locationEvent(location: string) {
    if (location.length === 0) {
      this.dataSource = this.tempDataSource;
    }
    this.filterSelection.set('location', location);
  }

  filterByLocations(location: string[], filteringDataSource: MatTableDataSource<DocumentMetadata>) {
    if (location.length !== 0) {
      this.tempDataSource.data.forEach(e => {
        location.forEach(s => {
          if (e.location === s) {
            filteringDataSource.data.push(e);
          }
        });
      });
    } else {
      console.log(this.dataSource);
      filteringDataSource.data = this.tempDataSource.data;
    }
  }

  languageEvent(language: string) {
    if (language.length === 0) {
      this.dataSource = this.tempDataSource;
    }
    this.filterSelection.set('language', language);
  }

  filterByLanguage(language: string[], filteringDataSource: MatTableDataSource<DocumentMetadata>) {
    const languageDataSource = new MatTableDataSource<DocumentMetadata>();
    if ( language.length !== 0) {
      filteringDataSource.data.forEach(e => {
          if (language.includes(e.language)) {
            languageDataSource.data.push(e);
            console.log(e);
          }
      });
      console.log(languageDataSource);
      filteringDataSource.data = languageDataSource.data;
  }
  }

  damageEvent(damage: string) {
    if (damage.length === 0) {
      this.dataSource = this.tempDataSource;
    }
    this.filterSelection.set('damage_type', damage);
  }

  filterByDamage(damage: string[], filteringDataSource: MatTableDataSource<DocumentMetadata>) {
    const damageDataSource = new MatTableDataSource<DocumentMetadata>();
    if ( damage.length !== 0) {
      filteringDataSource.data.forEach(e => {
        e.damage_type.forEach(value => {
          if (damage.includes(value)) {
            damageDataSource.data.push(e);
            console.log(e);
          }
        });
      });
      filteringDataSource.data = damageDataSource.data;
    }
  }

  searchEvent(event: Event) {
    this.tempEvent = event;
  }
  validSource(source: MatTableDataSource<DocumentMetadata>) {
    return source.data.length !== 0;
  }
}

