import {Injectable} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {DocumentMetadata, MapMetadata} from '../models/searchspace.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() {
  }

  /**
   * Filter the datasource using the filterSelection Map with categories and values of it. And returns the Datasoruce filtered.
   * @param filterSelection Map with keys of the categories to filter and the values of it
   * @param tempDataSource DataSource to filter
   * @return filteringDatasource Datasource filtered
   */
  applyFilter(filterSelection: Map<string, any>, tempDataSource: MatTableDataSource<any>) {
    const filteringDataSource = new MatTableDataSource<any>();
    filteringDataSource.data = tempDataSource.data;
    this.filterBySelection(filteringDataSource, filterSelection);
    return filteringDataSource;
  }

  /**
   *    * Using the filterSelection Map keys will filter the tempDatasource in the categories specified by the keys
   * with values in the map of the key corresponding to it.
   * @param filteringDataSource filterSelection Map with keys of the categories to filter and the values of it
   * @param filterSelection tempDataSource DataSource to filter
   */
  private filterBySelection(filteringDataSource: MatTableDataSource<any>, filterSelection: Map<string, any>) {
    const ite = filterSelection.keys();
    let invalidKey = false;
    for (const key of ite) {
      const tempFilterData = new MatTableDataSource<any>();
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
          } else {
            invalidKey = true;
          }
        }
        if (!invalidKey) {
          filteringDataSource.data = tempFilterData.data;
        }
      }
    }
  }
}
