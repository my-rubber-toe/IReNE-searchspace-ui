import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SearchSpaceService } from '../../../shared/services/searchspace.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DocumentMetadata } from '../../../shared/models/searchspace.model';
import { Router } from '@angular/router';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'app-documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DocumentsTableComponent implements OnInit {
  /**
   * To show and hide the table
   */
  @Input() show: boolean;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  /**
   * Event produced by the search bar with the words to use as filters
   */
  tempEvent: Event;
  dataSource: MatTableDataSource<DocumentMetadata>;
  tempDataSource: MatTableDataSource<DocumentMetadata>;
  displayedColumns: string[] = ['title', 'authors', 'location',
    'publication_date', 'incident_date', 'modification_date', 'infrastructure_type',
    'damage_type', 'language', 'tag', 'actions'];
  /**
   * Map of the categories to filter and what values to use as filters
   */
  filterSelection: Map<string, any> = new Map<string, any>([
    ['authors', ''],
    ['infrastructure_type', ''],
    ['damage_type', ''],
    ['language', ''],
    ['tag', ''],
    ['incident_date', ''],
    ['publication_date', '']
  ]);

  constructor(
    private filter: FilterService,
    private documentService: SearchSpaceService,
    private router: Router
  ) {
  }

  /**
   * Filter the data calling the service function with the selection of the filters to use and with the datasource that have
   * all the documents. Then will filter with the words in the searchbar using searchFilter(). After filtering calls paginateSort for
   * sorting and pagination.
   */
  applyFilter() {
    this.dataSource = this.filter.applyFilter(this.filterSelection, this.tempDataSource);
    if (this.tempEvent) {
      this.searchFilter(this.tempEvent);
    }
    this.paginateSort(this.dataSource);
  }

  /**\
   * Filter the datasource with value of the event.
   * @param event words to filter, the event is send it by the searchbar.
   */
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

  /**
   * Paginates and sorts the datasource.
   * @param table datasource to paginate and sort
   */
  paginateSort(table: MatTableDataSource<DocumentMetadata>) {
    table.sort = this.sort;
    table.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.documentService.getDocuments().add(() => {
      this.dataSource = new MatTableDataSource<DocumentMetadata>(this.documentService.documents);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate =
        (data: DocumentMetadata, filters: string, ) => {
          const matchFilter = [];
          const filterArray = filters.split(' ');
          const columns = (Object as any).values(data);
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

  /**
   * Set the values of the filters in the Map filterSelection.
   * @param selection value or values to use to filter.
   * @param type category of the filter.
   */
  selectionEvent(selection: any, type: string) {
    this.filterSelection.set(type, selection);
  }

  /**
   * Updates the event to filter using the searchbar
   * @param event words to filter by the searchbar.
   */
  searchEvent(event: Event) {
    this.tempEvent = event;
  }

  /**
   * Calls the view of a document by the id.
   * @param docId - Id of document to view.
   */
  previewDoc(docId: string) {
    this.router.navigate([`/preview/${docId}`]);
  }
}

