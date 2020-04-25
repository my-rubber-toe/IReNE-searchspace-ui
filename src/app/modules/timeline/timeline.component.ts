import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';
import { ChartEvent } from 'angular-google-charts';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Timeline } from 'src/app/shared/models/searchspace.model';
import { trigger } from '@angular/animations';

interface selectedTitle {
  selTitle: string
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
  timelineTitles: String [] ;
  /*
      parameters for timeline View
  */
  //title & data is filled in ngonInit()
  title = '';
  type = 'Timeline';
  columnNames = ['Event', 'Bar Label', 'Start', 'End'];
  options = {
    enableScrollWheel:true,
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
    enableInteractivity: false

  };
  data = [];
  width = 750;
  height = 550;
  /*
      parameters for timeline Table
  */
  //dataT & columnNamesT is filled in ngonInit()
  typeT = 'Table';
  columnNamesT = [];
  optionsT = {
    enableScrollWheel:true,
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
    enableInteractivity: false

  };
  dataT = [ ];
  widthT = 550;
  heightT = 450;
  titleT = 'Table';
  //compare function to sort events in table
  compareDate(a,b){
    if (a[1] === b[1]) {
      return 0;
  }
  else {
      return (a[1] < b[1]) ? -1 : 1;
  }

  }

  //sends selected value to ngonInit()
  sendValueCS(value) {
    this.docservice.setBehaviorViewCS({textVal: value});
  }
  //gets selected title from html
  updateCaseStudy(){
    const catTitle : selectedTitle = {
        selTitle: this.timeTitle.value
    }
      this.sendValueCS(catTitle.selTitle);
      return catTitle.selTitle;
  }
  onSelectT(e: ChartEvent){
    console.log(this.data[e[0].row[2]]);
  }
  onSelect(e: ChartEvent){
    console.log(this.data[e[0].row[2]]);

  }
  constructor(private docservice:SearchSpaceService, private fb: FormBuilder) { }

  ngOnInit(): void {
    //subscribe to service method getbehavior, in order to get a constant look of selected title
    this.docservice.getBehaviorViewCS().subscribe(cs => {
    this.docservice.docTimeline().add(() => {
      console.log(this.docservice.timeline);
      this.dataSource =  new MatTableDataSource<Timeline>(this.docservice.timeline);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      var timelineTitle = []
      //gets the title for each case study for the dropdown list in UI
      for(let i = 0; i < this.dataSource.filteredData.length; i++){
      timelineTitle[i] = (this.dataSource.filteredData[i].title);
      }
      this.timelineTitles = timelineTitle;
      var index = 0;
      //gets the position of the selected title from the filtered data provided by the server
      for(let i = 0; i < timelineTitle.length; i++){
          if( timelineTitle[i] == cs['textVal']){
              index = i;
              break;
          }
      }
      var timelineGraph = [];
      var timelineTable = [];
      var start = '';
      var end = '';
      var titleEvent = '';
      //prepares the data for the table & the graph
      for(let i = 0; i < this.dataSource.filteredData[index].timeline.length; i++){
        //for the graph
        start = this.dataSource.filteredData[index].timeline[i]['eventStartDate'];
        end = this.dataSource.filteredData[index].timeline[i]['eventEndDate'];
        timelineGraph[i] = [this.dataSource.filteredData[index].title,'',
        new Date(+start.substring(0,4), +start.substring(5,7), +start.substring(8,start.length)),
        new Date(+end.substring(0,4), +end.substring(5,7), +end.substring(8,start.length))];

        //for the table
        console.log(+start.substring(0,4), +start.substring(5,7), +start.substring(8,start.length));
        titleEvent = this.dataSource.filteredData[index].timeline[i]['event'];
        timelineTable[i] = [titleEvent,
          new Date(+start.substring(0,4), +start.substring(5,7), +start.substring(8,start.length)),
          new Date(+end.substring(0,4), +end.substring(5,7), +end.substring(8,start.length))];
      }

      this.columnNamesT = [this.dataSource.filteredData[index].title, 'StartDate', 'EndDate'];
      //sorts the events for the table
      timelineTable = timelineTable.sort(this.compareDate);
      //passes the data to the ui
      this.dataT = timelineTable;
      console.log(this.dataSource.filteredData[index].title)
      console.log(this.dataT);
      this.data = timelineGraph;
    });
  });
  }

}
