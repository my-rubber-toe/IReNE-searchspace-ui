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
  titleT = 'j';
  // sortedArray = this.dataT.sort(this.compareDate);
  compareDate(a,b){
    if (a[1] === b[1]) {
      return 0;
  }
  else {
      return (a[1] < b[1]) ? -1 : 1;
  }

  }
  sendValueCS(value) {
    this.docservice.setBehaviorViewCS({textVal: value});
    }
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
    // console.log(this.sortedArray);
    this.docservice.getBehaviorViewCS().subscribe(cs => {
    this.docservice.docTimeline().add(() => {
      this.dataSource =  new MatTableDataSource<Timeline>(this.docservice.timeline);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource.filteredData[0].timeline[0]['event']);
      console.log(this.dataSource.filteredData[0].title);

      var timelineTitle = []
      for(let i = 0; i < this.dataSource.filteredData.length; i++){
      timelineTitle[i] = (this.dataSource.filteredData[i].title);
      }
      this.timelineTitles = timelineTitle;
      var index = 0;
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
      for(let i = 0; i < this.dataSource.filteredData[index].timeline.length; i++){
        start = this.dataSource.filteredData[index].timeline[i]['startDate'];
        end = this.dataSource.filteredData[index].timeline[i]['endDate'];
        timelineGraph[i] = [this.dataSource.filteredData[index].title,'', 
        new Date(+start.substring(0,4), +start.substring(5,7), +start.substring(8,start.length)),
        new Date(+end.substring(0,4), +end.substring(5,7), +end.substring(8,start.length))];
        
        console.log(+start.substring(0,4), +start.substring(5,7), +start.substring(8,start.length));
        titleEvent = this.dataSource.filteredData[index].timeline[i]['event'];
        timelineTable[i] = [titleEvent, 
          new Date(+start.substring(0,4), +start.substring(5,7), +start.substring(8,start.length)),
          new Date(+end.substring(0,4), +end.substring(5,7), +end.substring(8,start.length))];
      }

      this.columnNamesT = [this.dataSource.filteredData[index].title, 'StartDate', 'EndDate'];
      timelineTable = timelineTable.sort(this.compareDate);
      this.dataT = timelineTable;
      this.data = timelineGraph;
    });
  });
  }

}
