import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';
import { ChartEvent } from 'angular-google-charts';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { XY } from 'src/app/shared/models/searchspace.model';

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


  title = '';
  type = 'BarChart';
   columnNames = [];
   options = {
    enableScrollWheel:true,
    showTip:true,
    isStacked:true,
    
   };
   data = [];
   width = 750;
   height = 550;
 
   
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
            for(let j = 0; j < this.dataSource.filteredData[i].damage_type.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].damage_type[j]))){
                key = String(this.dataSource.filteredData[i].damage_type[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].publication_date.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].damage_type[j])).push(this.dataSource.filteredData[i].publication_date.substr(0,4));
              }
            }
            if(!rowy.includes(this.dataSource.filteredData[i].publication_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].publication_date.substr(0,4));
            } 
          }
        }
        else if(x == 'Infrastructure' && y == 'Publication Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            for(let j = 0; j < this.dataSource.filteredData[i].infrastructure_type.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].infrastructure_type[j]))){
                key = String(this.dataSource.filteredData[i].infrastructure_type[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].publication_date.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].infrastructure_type[j])).push(this.dataSource.filteredData[i].publication_date.substr(0,4));
              }
            }
            if(!rowy.includes(this.dataSource.filteredData[i].publication_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].publication_date.substr(0,4));
            } 
          }
        }
        else if(x == 'Tag' && y == 'Publication Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            for(let j = 0; j < this.dataSource.filteredData[i].tag.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].tag[j]))){
                key = String(this.dataSource.filteredData[i].tag[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].publication_date.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].tag[j])).push(this.dataSource.filteredData[i].publication_date.substr(0,4));
              }
            }
            if(!rowy.includes(this.dataSource.filteredData[i].publication_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].publication_date.substr(0,4));
            } 
          }
        }

        else if(x == 'Damage' && y == 'Incident Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            for(let j = 0; j < this.dataSource.filteredData[i].damage_type.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].damage_type[j]))){
                key = String(this.dataSource.filteredData[i].damage_type[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].incident_date.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].damage_type[j])).push(this.dataSource.filteredData[i].incident_date.substr(0,4));
              }
            }
            if(!rowy.includes(this.dataSource.filteredData[i].incident_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].incident_date.substr(0,4));
            } 
          }
          console.log(map);
        }
        else if(x == 'Infrastructure' && y == 'Incident Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            for(let j = 0; j < this.dataSource.filteredData[i].infrastructure_type.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].infrastructure_type[j]))){
                key = String(this.dataSource.filteredData[i].infrastructure_type[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].incident_date.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].infrastructure_type[j])).push(this.dataSource.filteredData[i].incident_date.substr(0,4));
              }
            }
            if(!rowy.includes(this.dataSource.filteredData[i].incident_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].incident_date.substr(0,4));
            } 
          }
        }
        else if(x == 'Tag' && y == 'Incident Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            for(let j = 0; j < this.dataSource.filteredData[i].tag.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].tag[j]))){
                key = String(this.dataSource.filteredData[i].tag[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].incident_date.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].tag[j])).push(this.dataSource.filteredData[i].incident_date.substr(0,4));
              }
            }
            if(!rowy.includes(this.dataSource.filteredData[i].incident_date.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].incident_date.substr(0,4));
            } 
          }
        }
        //gives the count for each value within each type within cat x
        rowy = rowy.sort();
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
        this.title = 'Comparison Graph \n Where: \n X = ' + x + " & Y = " + y;
      }
      else {
          if(x == "Damage"){
            for(let i = 0; i<this.dataSource.filteredData.length;i++){
              for(let j = 0; j < this.dataSource.filteredData[i].damage_type.length; j++){
                  if(!map.has(String(this.dataSource.filteredData[i].damage_type[j]))){
                    key = String(this.dataSource.filteredData[i].damage_type[j]);
                    map.set(key, 1);
                  }
                  else{
                    map.set(String(this.dataSource.filteredData[i].damage_type[j]), map.get(String(this.dataSource.filteredData[i].damage_type[j])) + 1);
                  } 
               }
             }
          }
          else if(x == "Infrastructure"){
            for(let i = 0; i<this.dataSource.filteredData.length;i++){
              for(let j = 0; j < this.dataSource.filteredData[i].infrastructure_type.length; j++){
                  if(!map.has(String(this.dataSource.filteredData[i].infrastructure_type[j]))){
                    key = String(this.dataSource.filteredData[i].infrastructure_type[j]);
                    map.set(key, 1);
                  }
                  else{
                    map.set(String(this.dataSource.filteredData[i].infrastructure_type[j]), map.get(String(this.dataSource.filteredData[i].infrastructure_type[j])) + 1);
                  } 
               }
             }
          }
          else if(x == "Tag"){
            for(let i = 0; i<this.dataSource.filteredData.length;i++){
              for(let j = 0; j < this.dataSource.filteredData[i].tag.length; j++){
                  if(!map.has(String(this.dataSource.filteredData[i].tag[j]))){
                    key = String(this.dataSource.filteredData[i].tag[j]);
                    map.set(key, 1);
                  }
                  else{
                    map.set(String(this.dataSource.filteredData[i].tag[j]), map.get(String(this.dataSource.filteredData[i].tag[j])) + 1);
                  } 
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
        this.title = 'Comparison Graph \n Where: \n X = ' + x + " & Y = " + y;
      }    
    });
  });
 });
  }

}
