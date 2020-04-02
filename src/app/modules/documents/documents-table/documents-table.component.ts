import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {DocumentMetadata} from '../../../shared/models/searchspace.model';
import { DocumentsService } from '../../../shared/services/documents.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

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

  applyFilter(event: Event) {
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.tempEvent = event;
      if (filterValue === '') {
        this.show = false;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      } else {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        }
      this.paginateSort(this.dataSource);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  filterByLocations(location: string[]) {
    if (location.length === 0) {
      this.dataSource = this.tempDataSource;
      return;
    } else {
      const locationDataSource = new MatTableDataSource<DocumentMetadata>();
      this.tempDataSource.filteredData.forEach(e => {
        location.forEach(s => {
          if (e.location === s) {
            locationDataSource.data.push(e);
          }
        });
      });
      this.dataSource = locationDataSource;
    }
    this.applyFilter(this.tempEvent);
    return;
  }

  paginateSort(table: MatTableDataSource<DocumentMetadata>) {
    console.log('sort');
    table.sort = this.sort;
    table.paginator = this.paginator;
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
        (data: DocumentMetadata, filters: string) => {
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
      console.log(this.dataSource);
      this.tempDataSource = this.dataSource;
    });
  }
}

