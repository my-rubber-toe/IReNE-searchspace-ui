import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {SearchSpaceService} from 'src/app/shared/services/searchspace.service';
import {ChartEvent} from 'angular-google-charts';
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

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  dataSource: MatTableDataSource<Timeline>;
  timeTitle = new FormControl();
  timelineTitles: string [];
  displayedColumns: string[] = ['Event', 'Start Date', 'End Date'];
  elementTimeline: timelinetabledoc[] = [];
  timelinesource: MatTableDataSource<timelinetabledoc>;

  /*
      parameters for timeline View
  */
  // title & data is filled in ngonInit()
  title = '';
  type = 'Timeline';
  columnNames = ['Event', 'Bar Label', 'Start', 'End'];
  options = {
    enableScrollWheel: true,
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],


  };
  data = [];
  width = 750;
  height = 550;
  /*
      parameters for timeline Table
  */
  // dataT & columnNamesT is filled in ngonInit()
  dataT = [];

  // compare function to sort events in table
  compareDate(a, b) {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return (a[1] < b[1]) ? -1 : 1;
    }

  }

  // sends selected value to ngonInit()
  sendValueCS(value) {
    this.docService.setBehaviorViewCS({textVal: value});
  }

  // gets selected title from html
  updateCaseStudy() {
    const catTitle: selectedTitle = {
      selTitle: this.timeTitle.value
    };
    this.sendValueCS(catTitle.selTitle);
    return catTitle.selTitle;
  }

  paginateSort(table: MatTableDataSource<Timeline>) {
    table.sort = this.sort;
    table.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor(private docService: SearchSpaceService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    // subscribe to service method getbehavior, in order to get a constant look of selected title
    this.docService.docTimeline().add(() => {
      this.docService.getBehaviorViewCS().subscribe(cs => {
        this.dataSource = new MatTableDataSource<Timeline>(this.docService.timeline);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        const timelineTitle = [];

        // gets the title for each case study for the dropdown list in UI
        for (let i = 0; i < this.dataSource.filteredData.length; i++) {
          timelineTitle[i] = (this.dataSource.filteredData[i].title);
        }
        this.timelineTitles = timelineTitle;
        let index = 0;
        // gets the position of the selected title from the filtered data provided by the server
        for (let i = 0; i < timelineTitle.length; i++) {
          if (timelineTitle[i] === cs.textVal) {
            index = i;
            break;
          }
        }
        const timelineGraph = [];
        let timelineTable = [];
        let start = '';
        let end = '';
        let titleEvent = '';
        // prepares the data for the table & the graph

        for (let i = 0; i < this.dataSource.filteredData[index].timeline.length; i++) {
          // for the graph
          start = this.dataSource.filteredData[index].timeline[i][`eventStartDate`];
          end = this.dataSource.filteredData[index].timeline[i][`eventEndDate`];
          timelineGraph[i] = [this.dataSource.filteredData[index].title, '',
            Date.parse(start), Date.parse(end)];

          // for the table
          titleEvent = this.dataSource.filteredData[index].timeline[i][`event`];
          timelineTable[i] = [titleEvent, new Date(Date.parse(start)), new Date((Date.parse(end)))];
        }

        // sorts the events for the table
        timelineTable = timelineTable.sort(this.compareDate);

        // passes the data to the ui
        this.dataT = timelineTable;
        this.data = timelineGraph;
        let startDate = '';
        let endDate = '';
        for (let i = 0; i < timelineTable.length; i++) {
          startDate = String(timelineTable[i][1]);
          endDate = String(timelineTable[i][2]);
          this.elementTimeline[i] = {
            event: timelineTable[i][0],
            start: startDate.substring(3, 7) + '. ' + startDate.substring(8, 16),
            end: endDate.substring(3, 7) + '. ' + endDate.substring(8, 16)
          };
        }
        this.timelinesource = new MatTableDataSource<timelinetabledoc>(this.elementTimeline);
      });
      this.timeTitle.setValue(this.dataSource.filteredData[0].title);
    });
  }

}
