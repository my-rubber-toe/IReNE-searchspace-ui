import { Injectable } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {DocumentMetadata} from '../models/searchspace.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() {
  }

  applyFilter(filterSelection: Map<string, any>, tempDataSource: MatTableDataSource<DocumentMetadata>) {
    const filteringDataSource = new MatTableDataSource<DocumentMetadata>();
    filteringDataSource.data = tempDataSource.data;
    this.filterBySelection(filteringDataSource, filterSelection);
    return filteringDataSource;
  }

  private filterBySelection(filteringDataSource: MatTableDataSource<DocumentMetadata>, filterSelection: Map<string, any>) {
    const ite = filterSelection.keys();
    for (const key of ite) {
      const tempFilterData = new MatTableDataSource<DocumentMetadata>();
      const filter = filterSelection.get(key);
      if (filter.length !== 0) {
        const iter = filteringDataSource.data.values();
        for (const value of iter) {
          if (value[key] !== undefined) {
            for (const x of filter) {
              if (value[key].includes(x)) {
                tempFilterData.data.push(value);
                break;
              }
            }
          }
        }
        if (tempFilterData.data.length !== 0 ) {
          filteringDataSource.data = tempFilterData.data;
        }
      }
    }
  }
}
