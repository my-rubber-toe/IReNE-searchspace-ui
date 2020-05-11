import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SearchSpaceService} from '../../../shared/services/searchspace.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DocumentMetadata} from '../../../shared/models/searchspace.model';
import {Router} from '@angular/router';
import {FilterService} from '../../../shared/services/filter.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class DocumentsTableComponent implements OnInit {
  /**
   * Paginator used on the table
   */
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  /**
   * Sorting used on the table
   */
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  /**
   * Event produced by the search bar with the words to use as filters
   */
  tempEvent: string;
  /**
   * Data source to use on the table
   */
  dataSource: MatTableDataSource<DocumentMetadata>;
  /**
   * Save the original Data Source values for recovery
   */
  tempDataSource: MatTableDataSource<DocumentMetadata>;
  /**
   * Columns to display on the table
   */
  displayedColumns: string[] = ['title', 'creatorFullName',
    'creationDate', 'incidentDate', 'lastModificationDate',
    'language', 'actions'];
  /**
   * Expanded row
   */
  expandedElement: DocumentMetadata | null;
  /**
   * Map of the categories to filter and what values to use as filters
   */
  filterSelection: Map<string, any> = new Map<string, any>([
    ['authorFullName', ''],
    ['infrasDocList', ''],
    ['damageDocList', ''],
    ['language', ''],
    ['tagsDoc', ''],
    ['incidentDate', ''],
    ['creationDate', '']
  ]);
  /**
   * Progress value for the progress bar
   */
  public value = 0;
  /**
   * Boolean to indicate if the documents finished loading
   */
  loading = true;
  /**
   * Subscription to the request to get documents
   */
  private subscription: Subscription;

  constructor(
    private filter: FilterService,
    private documentService: SearchSpaceService,
    private router: Router
  ) {
  }

  /**
   * Filter the data calling the service function with the selection of the filters to use and with the data source that have
   * all the documents. Then will filter with the words in the search bar using searchFilter(). After filtering calls paginateSort for
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
   * Filter the data source with value of the event.
   * @param event words to filter, the event is send it by the search bar.
   */
  searchFilter(event) {
    if (typeof event !== 'undefined') {
      this.subscription.add((() => {
        this.dataSource.filter = event.trim().toLowerCase();
        this.tempEvent = event;
        this.subscription.unsubscribe();
      }));
    }
  }

  /**
   * Paginates and sorts the data source.
   * @param table data source to paginate and sort
   */
  paginateSort(table: MatTableDataSource<DocumentMetadata>) {
    table.sort = this.sort;
    table.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Gets the documents and create the Data Source fot the table with it. Declare the custom filter predicate to use on the data filter,
   *
   * paginate and sorts the data source. Also updates the value of the progress bar based on the http events.
   */
  ngOnInit(): void {
    this.subscription = this.documentService.getDocuments().subscribe((event: HttpEvent<any>) => {
      if (event.type === HttpEventType.DownloadProgress) {
        this.value = event.loaded / event.total * 100;
      }
      if (event.type === HttpEventType.Response) {
        this.dataSource = new MatTableDataSource<DocumentMetadata>(event.body[`message`]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate =
          (data: DocumentMetadata, filters: string,) => {
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
        this.loading = false;
      }
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
   * Updates the event to filter using the search bar
   * @param event words to filter by the search bar.
   */
  searchEvent(event: Event) {
    this.tempEvent = (event.target as HTMLInputElement).value;
  }

  /**
   * Calls the view of a document by the id.
   * @param docId - Id of document to view.
   */
  previewDoc(docId: string) {
    this.router.navigate([`/preview/${docId}`]);
  }
}
