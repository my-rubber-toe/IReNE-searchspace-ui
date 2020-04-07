import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
// import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';
import { ChartEvent } from 'angular-google-charts';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { XY } from 'src/app/shared/models/searchspace.model';
import { query } from '@angular/animations';
import { XyModule } from './xy.module';
import { validateBasis } from '@angular/flex-layout';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';

interface CatXValues {
  cat_x: string
}
interface CatYValues {
  cat_y: string
}
@Component({
  selector: 'app-xy',
  templateUrl: './xy.component.html',
  styleUrls: ['./xy.component.scss']
  // template: `<app-barChart></app-barChart>`
})
export class XyComponent implements OnInit {
  @Input() show: boolean;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  tempEvent: Event;
  dataSource: MatTableDataSource<XY>;
  tempDataSource: MatTableDataSource<XY>;
  events: string[] = [];
  category_x = new FormControl();
  categoryX: string[] = ['Infrastructure', 'Damage', 'Tag'];

  // structureList: string[] = ['Transportation', 'Energy', 'Water', 'Security', 'Ports', 'Structure', 'Construction'];
  // dmgList: string[] = ['Fire', 'Flooding', 'Broken Sewer'];
  category_y = new FormControl();
  categoryY: string[] = ['Number of Cases', 'Incident Date', 'Publication Date'];
  //char


  title = 'Comparison Graph';
  type = 'BarChart';
   columnNames = [];
   options = {
    enableScrollWheel:true,
    showTip:true,
    isStacked:true
   };
   data = [];
   myRoles = [
    { role: 'annotation', type: 'string', index: 6}
  ];
   width = 550;
   height = 400;
 
   
   sendValueX(value) {
    this.docservice.setBehaviorViewX({textVal: value});
    }
   sendValueY(value) {
    this.docservice.setBehaviorViewY({textVal: value});
    }
    updateCatX(){
      const catxVal : CatXValues = {
       cat_x: this.category_x.value
      }
      this.sendValueX(catxVal.cat_x);
      return catxVal.cat_x;
    }
    updateCatY(){
      const catyVal : CatYValues = {
       cat_y: this.category_y.value
      }
      this.sendValueY(catyVal.cat_y);
      return catyVal.cat_y;
    }

   onSelect(e: ChartEvent){
     console.log(this.data[e[0].row[2]]);
   }
  constructor(private docservice:SearchSpaceService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.docservice.getBehaviorViewX().subscribe(vx => {
    this.docservice.getBehaviorViewY().subscribe(vy => {
    this.docservice.docXY().add(() => {
      console.log(vx['textVal']);
      console.log(vy['textVal']);
      this.dataSource =  new MatTableDataSource<XY>(this.docservice.comparison);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      // var x = this.selected;
      // console.log(x);
      const x = vx['textVal'];
      const y = vy['textVal'];
      
      let map = new Map();
      let key = '';
      let value = '';
      let row = [];
      let rowx = [];
      let rowy = [];
      //fills hashmap to get the category y within each category x
      if(y != 'Number of Cases'){
        if(x == 'Damage' && y == 'Publication Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            if(!map.has(String(this.dataSource.filteredData[i].damage_type))){
              key = String(this.dataSource.filteredData[i].damage_type);
              rowx.push(key);
              value = this.dataSource.filteredData[i].publication_date.substr(0,4);
              map.set(key,new Array(value));
            }
            else{
              map.get(String(this.dataSource.filteredData[i].damage_type)).push(this.dataSource.filteredData[i].publication_date.substr(0,4));
            }
            if(!rowy.includes(this.dataSource.filteredData[i].publication_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].publication_date.substr(0,4));
            } 
          }
        }
        else if(x == 'Infrastructure' && y == 'Publication Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            if(!map.has(String(this.dataSource.filteredData[i].infrastructure_type))){
              key = String(this.dataSource.filteredData[i].infrastructure_type);
              rowx.push(key);
              value = this.dataSource.filteredData[i].publication_date.substr(0,4);
              map.set(key,new Array(value));
            }
            else{
              map.get(String(this.dataSource.filteredData[i].infrastructure_type)).push(this.dataSource.filteredData[i].publication_date.substr(0,4));
            } 
            if(!rowy.includes(this.dataSource.filteredData[i].publication_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].publication_date.substr(0,4));
            }
          }
        }
        else if(x == 'Tag' && y == 'Publication Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            if(!map.has(String(this.dataSource.filteredData[i].tag))){
              key = String(this.dataSource.filteredData[i].tag);
              rowx.push(key);
              value = this.dataSource.filteredData[i].publication_date.substr(0,4); 
              map.set(key,new Array(value));
            }
            else{
              map.get(String(this.dataSource.filteredData[i].tag)).push(this.dataSource.filteredData[i].publication_date.substr(0,4));
            }
            if(!rowy.includes(this.dataSource.filteredData[i].publication_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].publication_date.substr(0,4));
            } 
          }
        }

        else if(x == 'Damage' && y == 'Incident Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            if(!map.has(String(this.dataSource.filteredData[i].damage_type))){
              key = String(this.dataSource.filteredData[i].damage_type);
              rowx.push(key);
              value = this.dataSource.filteredData[i].incident_date.substr(0,4); 
              map.set(key,new Array(value));
            }
            else{
              map.get(String(this.dataSource.filteredData[i].damage_type)).push(this.dataSource.filteredData[i].incident_date.substr(0,4));
            }
            if(!rowy.includes(this.dataSource.filteredData[i].incident_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].incident_date.substr(0,4));
            }
          }
        }
        else if(x == 'Infrastructure' && y == 'Incident Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            if(!map.has(String(this.dataSource.filteredData[i].infrastructure_type))){
              key = String(this.dataSource.filteredData[i].infrastructure_type);
              rowx.push(key);
              value = this.dataSource.filteredData[i].incident_date.substr(0,4); 
              map.set(key,new Array(value));
            }
            else{
              map.get(String(this.dataSource.filteredData[i].infrastructure_type)).push(this.dataSource.filteredData[i].incident_date.substr(0,4));
            } 
            if(!rowy.includes(this.dataSource.filteredData[i].incident_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].incident_date.substr(0,4));
            }
          }
        }
        else if(x == 'Tag' && y == 'Incident Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            if(!map.has(String(this.dataSource.filteredData[i].tag))){
              key = String(this.dataSource.filteredData[i].tag);
              rowx.push(key);
              value = this.dataSource.filteredData[i].incident_date.substr(0,4);
              map.set(key,new Array(value));
            }
            else{
              map.get(String(this.dataSource.filteredData[i].tag)).push(this.dataSource.filteredData[i].incident_date.substr(0,4));
            } 
            if(!rowy.includes(this.dataSource.filteredData[i].incident_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].incident_date.substr(0,4));
            } 
          }
        }
        //gives the count for each value within each type within cat x
        
        let countsy = []; 
        map.forEach((value: string, key: string) => {
              let countValue = [];
              console.log(key,value);
              for(let i = 0; i < value.length; i++){
                countValue[value[i]] = 1 + (countValue[value[i]] || 0); 
              }
              for(let i = 0; i < rowy.length; i++){
                if(countValue[rowy[i]] == null){
                  countValue[rowy[i]] = 0;
                }

              }
              let filteredArr = countValue.filter(function(value){ return value != null;});
              console.log(filteredArr);
              countsy.push(filteredArr);
              
        });
        console.log(countsy);
        //sets the data table for the chart
        for(let i = 0; i < rowx.length; i++){
          
          row[i] = countsy[i];
          row[i].unshift(rowx[i]);
        }
        
        this.columnNames = rowy;
        this.columnNames.unshift(x);
        console.log(this.columnNames);
        this.data = row;
      }
      else {
          if(x == "Damage"){
            for(let i = 0; i<this.dataSource.filteredData.length;i++){
                  if(!map.has(String(this.dataSource.filteredData[i].damage_type))){
                    key = String(this.dataSource.filteredData[i].damage_type);
                    map.set(key, 1);
                  }
                  else{
                    map.set(String(this.dataSource.filteredData[i].damage_type), map.get(String(this.dataSource.filteredData[i].damage_type)) + 1);
                  } 
             }
          }
          else if(x == "Infrastructure"){
            for(let i = 0; i<this.dataSource.filteredData.length;i++){
                if(!map.has(String(this.dataSource.filteredData[i].infrastructure_type))){
                    key = String(this.dataSource.filteredData[i].infrastructure_type);
                    map.set(key, 1);
                  }
                  else{
                    map.set(String(this.dataSource.filteredData[i].infrastructure_type), map.get(String(this.dataSource.filteredData[i].infrastructure_type)) + 1);
                } 
               }
          }
          else if(x == "Tag"){
            for(let i = 0; i<this.dataSource.filteredData.length;i++){
                  if(!map.has(String(this.dataSource.filteredData[i].tag))){
                    key = String(this.dataSource.filteredData[i].tag);
                    map.set(key, 1);
                  }
                  else{
                    map.set(String(this.dataSource.filteredData[i].tag), map.get(String(this.dataSource.filteredData[i].tag)) + 1);
                  } 
             }
          }
        //sets the data table for the chart
        let index = 0;
        map.forEach((value: number, key: string) => {
            row[index] = [key, value];
            console.log(row);
            index++;
         });
        this.columnNames = [x,y];
        this.data = row;
      }    
    });
  });
 });
  }

}
