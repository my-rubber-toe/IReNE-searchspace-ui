import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {SearchSpaceService} from '../../../shared/services/searchspace.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DocumentMetadata } from '../../../shared/models/searchspace.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.css'],
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
    'damage_type', 'language', 'tag', 'actions'];
  filterSelection: Map<string, any> = new Map<string, any>([
   // ['location', ''],
    ['creators', ''],
    ['infrastructure_type', ''],
    ['damage_type', ''],
    ['language', ''],
    ['tag', ''],
    ['incident_date', ''],
    ['publication_date', '']
  ]);

  applyFilter() {
    const filteringDataSource = new MatTableDataSource<DocumentMetadata>();
    // this.filterByLocations(this.filterSelection.get('location'), filteringDataSource);
    this.filterByLanguage(this.filterSelection.get('language'), filteringDataSource);
    this.filterBySelection(this.filterSelection.get('tag'), filteringDataSource, 'tag');
    this.filterBySelection(this.filterSelection.get('damage_type'), filteringDataSource, 'damage_type');
    this.filterBySelection(this.filterSelection.get('infrastructure_type'), filteringDataSource, 'infrastructure_type');
    this.filterBySelection(this.filterSelection.get('publication_date'), filteringDataSource, 'publication_date');
    this.filterBySelection(this.filterSelection.get('incident_date'), filteringDataSource, 'incident_date');
    this.filterBySelection(this.filterSelection.get('creators'), filteringDataSource, 'creators');
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
    private documentService: SearchSpaceService,
    private router: Router
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

  locationEvent(location: string) {
    if (location.length === 0) {
      this.dataSource = this.tempDataSource;
    }
    this.filterSelection.set('location', location);
  }

/** filterByLocations(location: string[], filteringDataSource: MatTableDataSource<DocumentMetadata>) {
      if (location.length !== 0) {
      this.tempDataSource.data.forEach(e => {
        location.forEach(s => {
          if (e.location === s) {
            filteringDataSource.data.push(e);
          }
        });
      });
    } else {
      filteringDataSource.data = this.tempDataSource.data;
    }
  } **/

  selectionEvent(selection: any, type: string) {
    if (selection.length === 0) {
      this.dataSource = this.tempDataSource;
    }
    this.filterSelection.set(type, selection);
  }

  searchEvent(event: Event) {
    this.tempEvent = event;
  }
  previewDoc(docId: string) {
    this.router.navigate([`/preview/${docId}`]);
  }
}

