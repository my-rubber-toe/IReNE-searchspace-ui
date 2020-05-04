import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl} from '@angular/forms';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { XY } from 'src/app/shared/models/searchspace.model';

interface CatXValues {
  cat_x: string;
}

interface CatYValues {
  cat_y: string;
}

@Component({
  selector: 'app-xy',
  templateUrl: './xy.component.html',
  styleUrls: ['./xy.component.scss']
})

export class XyComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  dataSource: MatTableDataSource<XY>;
  events: string[] = [];
  // tslint:disable-next-line:variable-name
  category_x = new FormControl();
  categoryX: string[] = ['Infrastructure', 'Damage', 'Tag'];

  // tslint:disable-next-line:variable-name
  category_y = new FormControl();
  categoryY: string[] = ['Number of Cases', 'Incident Date', 'Publication Date'];

  // title and columnNames is filled in ngOnInit()
  title = '';
  type = 'BarChart';
  columnNames = [];
  options = {};
  // data is filled in ngOnInit()
  data = [];
  width = 1000;
  height = 550;

  verticalDict = {
    Damage: 'damageDocList',
    Infrastructure: 'infrasDocList',
    Tag: 'tagsDoc'
  };

  horizontalDict = {
    'Publication Date': 'creationDate',
    'Incident Date': 'incidentDate'
  };

  // sends the value to use in ngOnInit()
  sendValueX(value) {
    this.docService.setBehaviorViewX({textVal: value});
  }

  sendValueY(value) {
    this.docService.setBehaviorViewY({textVal: value});
  }

  // gets the value from html
  updateCatX() {
    const catxVal: CatXValues = {
      cat_x: this.category_x.value
    };
    this.sendValueX(catxVal.cat_x);
    return catxVal.cat_x;
  }

  updateCatY() {
    const catyVal: CatYValues = {
      cat_y: this.category_y.value
    };
    this.sendValueY(catyVal.cat_y);
    return catyVal.cat_y;
  }

  constructor(private docService: SearchSpaceService) {
    this.category_x.setValue('Damage');
    this.category_y.setValue('Publication Date');

  }

  ngOnInit(): void {
    this.docService.docXY().add(() => {
      this.docService.getBehaviorViewX().subscribe(vx => {
        this.docService.getBehaviorViewY().subscribe(vy => {
          this.dataSource = new MatTableDataSource<XY>(this.docService.comparison);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // values from the selection of category x & y
          const x = vx.textVal;
          const y = vy.textVal;

          const map = new Map();
          const key = '';
          const value = '';
          const row = [];
          const rowx = [];
          let rowy = [];
          // fills hashmap to get the category y within each category x
          for (const i of this.dataSource.filteredData) {
            if (y !== 'Number of Cases') {
              for (const j of i[this.verticalDict[x]]) {
                this.setDatesMap(i, j, map, key, value, rowx, rowy, this.horizontalDict[y]);
              }
            } else {
              // the hash map here is built with category x as key and value as ocurrecences of catX
              for (const j of i[this.verticalDict[x]]) {
                this.setCountMap(i, j, map, key);
              }
            }
          }
          if (y === 'Number of Cases') {
            // sets the data table for the chart
            let index = 0;
            // tslint:disable-next-line:no-shadowed-variable
            map.forEach((value: number, key: string) => {
              row[index] = [key, value];
              index++;
            });
            this.columnNames = [x, y];
            this.data = row;
            this.title = 'Comparison Graph';
            this.options = {
                enableScrollWheel: true,
                showTip: true,
                isStacked: true,
                hAxis: {
                  title: 'Number of Cases',
                  titleFontSize: 20
                },
                vAxis: {
                  title: 'Categories of Type ' + x,
                  titleFontSize: 20
                },
                fontSize: 10,
                titleFontSize: 30,
                legendFontSize: 14
               };
            this.height = row.length * 50;
          } else {
            // gives the count for each value within each type within cat x
            rowy = rowy.sort();
            const countsy = [];
            // tslint:disable-next-line:no-shadowed-variable
            map.forEach((value: string, key: string) => {
              const countValue = [];
              for (const i of value) {
                // fills an array with length of the year
                // this is to have a sort of count per year
                countValue[i] = 1 + (countValue[i] || 0);
              }
              // the category x that doesn't have a certain value from category y is put a 0
              // this way that year will have a count of 0 documents
              for (const i of rowy) {
                if (countValue[i] == null) {
                  countValue[i] = 0;
                }

              }
              // returns an array with no null values
              // tslint:disable-next-line:no-shadowed-variable
              const filteredArr = countValue.filter((value) => value != null);
              countsy.push(filteredArr);

            });
            // sets the data table for the chart
            for (let i = 0; i < rowx.length; i++) {

              row[i] = countsy[i];
              row[i].unshift(rowx[i]);
            }

            this.columnNames = rowy;
            this.columnNames.unshift(x);
            this.data = row;
            this.title = 'Comparison Graph';
            this.options = {
              enableScrollWheel: true,
              showTip: true,
              isStacked: true,
              hAxis: {
                title: 'Number of Cases filtered by ' + y,
                titleFontSize: 15
              },
              vAxis: {
                title: 'Categories of Type ' + x,
                titleFontSize: 15
              },
              fontSize: 10,
              titleFontSize: 30,
              legendFontSize: 14
              };
            this.height = row.length * 50;
          }
        });
      });
    });
  }

  setDatesMap(i, j, map: Map<any, any>, key: string, value: string, rowx: any[], rowy: any[], cat: string) {
    if (!map.has(String(j))) {
      key = String(j);
      rowx.push(key);
      value = i[cat].substr(0, 4);
      map.set(key, new Array(value));
    } else {
      map.get(String(j)
      ).push(i[cat].substr(0, 4));
    }
    // gets the distinct category y
    if (!rowy.includes(i[cat].substr(0, 4))) {
      rowy.unshift(i[cat].substr(0, 4));
    }
  }

  setCountMap(i, j, map: Map<any, any>, key: string) {
    if (!map.has(String(j))) {
      key = String(j);
      map.set(key, 1);
    } else {
      map.set(String(j),
        map.get(String(j)) + 1);
    }
  }
}
