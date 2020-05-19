/*
  Author: Jainel M. Torres Santos <jainel.torres@upr.edu>
*/

import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SearchSpaceService} from 'src/app/shared/services/searchspace.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Timeline} from 'src/app/shared/models/searchspace.model';

// tslint:disable-next-line:class-name
interface selectedTitle {
  selTitle: string;
}

// tslint:disable-next-line:class-name
interface timelinetabledoc {
  event: string;
  start: string;
  end: string;
}

// tslint:disable-next-line:class-name
interface selectedCat {
  infrasDocList: string;
  damageDocList: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  dataSource: MatTableDataSource<Timeline>;
  tempDataSource: MatTableDataSource<Timeline>;
  timelinesource: MatTableDataSource<timelinetabledoc>;
  titleSource: MatTableDataSource<selectedTitle>;

  eventList: timelinetabledoc[];
  displayedColumns: string[] = ['Event', 'Start Date', 'End Date'];
  displayedColumns1: string[] = ['Title'];
  elementTimeline: timelinetabledoc[] = [];
  elementTitle: selectedTitle[] = [];

  //drop down lists in UI
  timeTitle = new FormControl();
  timelineTitles: string [];

  infrastructure = new FormControl();
  infrastructureList: string[];

  damage = new FormControl();
  damageList: string[];


  //the index of the row to highlight
  selectedRowIndex: number = -1 ;
  /*
      parameters for timeline View
      title & data is filled in ngonInit()
  */
  title = '';
  type = 'Timeline';
  columnNames = ['Event', 'Bar Label', 'Start', 'End'];
  options = {
    enableScrollWheel: true,
    colors: ['#e6693e', '#f6c7b6']
  };
  data = [];
  width = 850;
  height = 650;

  constructor(private docservice: SearchSpaceService) {
    this.infrastructure.setValue(['Building']);
    this.damage.setValue(['Earthquake']);
    this.updateTCAT();
  }

  // compare function to sort events in table
  compareDate(a, b) {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return (a[1] < b[1]) ? -1 : 1;
    }

  }

  // sends selected title to ngonInit()
  sendValueCS(value) {
    this.docservice.setBehaviorViewCS({textVal: value});
  }

  // gets selected title selected from html
  updateCaseStudy() {
    const catTitle: selectedTitle = {
      selTitle: this.timeTitle.value
    };
    this.sendValueCS(catTitle.selTitle);
    return catTitle.selTitle;
  }

  // sends selected categories to ngonInit()
  sendValueTCAT(infras, damage) {
    this.docservice.setBehaviorViewTCAT({
      infrasDocList: infras,
      damageDocList: damage
    });
  }

  // gets selected categories from html
  updateTCAT() {
    const cat: selectedCat = {
      infrasDocList: this.infrastructure.value,
      damageDocList: this.damage.value
    };
    this.sendValueTCAT(cat.infrasDocList, cat.damageDocList);
  }

  //Gives the index of the selected event on the graph
  onSelect(event){
    for(let i = 0; i < this.timelinesource.filteredData.length; i++){
      if(this.data[event[0].row][1] == this.timelinesource.filteredData[i].event){
        this.selectedRowIndex = i;
      }
    }
  }
  //highlights the selected event on the table
  showForEdit(row) {
    this.selectedRowIndex = row;
  }

  ngOnInit(): void {
    // gets all the categories available
    this.docservice.getFilters().add(() => {
      this.infrastructureList = this.docservice.filters[`infrastructures`];
      this.damageList = this.docservice.filters[`damages`];
    });
    // subscribe to service method getbehavior, in order to get a constant look of selected title
    this.docservice.docTimeline().add(() => {
      this.docservice.getBehaviorViewTCAT().subscribe(cats => {
        this.docservice.getBehaviorViewCS().subscribe(cs => {

          // Data sources
          this.dataSource = new MatTableDataSource<Timeline>(this.docservice.timeline);
          this.tempDataSource = new MatTableDataSource<Timeline>();
          this.timelinesource = new MatTableDataSource<timelinetabledoc>();

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          let timelineTitle = [];

          //reset index for row highlight
          this.selectedRowIndex = -1;

          // sets default value for case study
          for (let i = 0; i < this.dataSource.filteredData.length; i++) {
            if (typeof this.dataSource.filteredData[i].timeline !== 'undefined' && this.dataSource.filteredData[i].timeline.length !== 0) {
              this.timeTitle.setValue(this.dataSource.filteredData[i].title);
              break;
            }
          }

          // gets the title for each case study for the dropdown list in UI
          // also sets the tempdatasource with the filtered categories selected
          if (cats.infrasDocList.length == 0) {
            for (let i = 0; i < this.dataSource.filteredData.length; i++) {
              for (let k = 0; k < cats.damageDocList.length; k++) {
                if (this.dataSource.filteredData[i].damageDocList.includes(cats.damageDocList[k])
                  && !timelineTitle.includes(this.dataSource.filteredData[i].title)) {
                  timelineTitle.push(this.dataSource.filteredData[i].title);
                  this.tempDataSource.data.push(this.dataSource.filteredData[i]);
                }
              }
            }
          } else if (cats.damageDocList.length == 0) {
            for (let i = 0; i < this.dataSource.filteredData.length; i++) {
              for (let j = 0; j < cats.infrasDocList.length; j++) {
                if (this.dataSource.filteredData[i].infrasDocList.includes(cats.infrasDocList[j])
                  && !timelineTitle.includes(this.dataSource.filteredData[i].title)) {
                  timelineTitle.push(this.dataSource.filteredData[i].title);
                  this.tempDataSource.data.push(this.dataSource.filteredData[i]);
                }
              }
            }
          } else {
            for (let i = 0; i < this.dataSource.filteredData.length; i++) {
              for (let j = 0; j < cats.infrasDocList.length; j++) {
                for (let k = 0; k < cats.damageDocList.length; k++) {
                  if ((this.dataSource.filteredData[i].infrasDocList.includes(cats.infrasDocList[j])
                    || this.dataSource.filteredData[i].damageDocList.includes(cats.damageDocList[k]))
                    && !timelineTitle.includes(this.dataSource.filteredData[i].title)
                    && typeof this.dataSource.filteredData[i].timeline !== 'undefined'
                    && this.dataSource.filteredData[i].timeline.length !== 0 ) {
                    timelineTitle.push(this.dataSource.filteredData[i].title);
                    this.tempDataSource.data.push(this.dataSource.filteredData[i]);

                  }
                }
              }
            }
          }
          this.timelineTitles = timelineTitle;
          let index = 0;
          // gets the position of the selected title from the filtered data provided by the server
          for (let i = 0; i < this.timelineTitles.length; i++) {
            if (this.timelineTitles[i] == cs.textVal) {
              index = i;
              this.timeTitle.setValue(cs.textVal);
              break;
            }
          }

          let timelineGraph = [];
          let timelineTable = [];

          let start = '';
          let end = '';
          let titleEvent = '';
          // prepares the data for the table & the graph
          for (let i = 0; i < this.tempDataSource.filteredData[index].timeline.length; i++) {
            // for the graph
            start = this.tempDataSource.filteredData[index].timeline[i][`eventStartDate`];
            end = this.tempDataSource.filteredData[index].timeline[i][`eventEndDate`];

            timelineGraph[i] = ['Timeline', this.tempDataSource.filteredData[index].timeline[i]['event'],
              Date.parse(start), Date.parse(end) + 100000000];

            // for the table
            titleEvent = this.tempDataSource.filteredData[index].timeline[i]['event'];
            timelineTable[i] = [titleEvent, new Date(Date.parse(start)), new Date((Date.parse(end)))];
          }
          // sorts the events for the table
          timelineTable = timelineTable.sort(this.compareDate);

          // passes the data to the ui
          this.data = timelineGraph;
          let start_date = '';
          let end_date = '';
          for (let i = 0; i < timelineTable.length; i++) {
            start_date = String(timelineTable[i][1]);
            end_date = String(timelineTable[i][2]);
            this.elementTimeline[i] = {
              event: timelineTable[i][0],
              start: start_date.substring(3, 7) + '. ' + start_date.substring(8, 16),
              end: end_date.substring(3, 7) + '. ' + end_date.substring(8, 16)
            };
          }
          this.timelinesource = new MatTableDataSource<timelinetabledoc>(this.elementTimeline);

          //datatable for the header table
          this.elementTitle[0] = {
            selTitle: this.tempDataSource.filteredData[index].title};
          this.titleSource = new  MatTableDataSource<selectedTitle>(this.elementTitle);

        });
      });
    });
  }
}
