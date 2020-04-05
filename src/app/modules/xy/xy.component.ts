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
import { Subject } from 'rxjs';

interface CatXValues {
  cat_x: string
}
interface CatYValues {
  numberCases: string,
  pubDate: string,
  inDate: string
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
  subject =  new Subject();
  events: string[] = [];
  category_x = new FormControl();
  categoryX: string[] = ['Infrastructure', 'Damage', 'Tag'];

  structureList: string[] = ['Transportation', 'Energy', 'Water', 'Security', 'Ports', 'Structure', 'Construction'];
  dmgList: string[] = ['Fire', 'Flooding', 'Broken Sewer'];
  
  categoryY: string[] = ['Number of Cases', 'Incident Date', 'Publication Date'];
  //chart
  selectedValue: string = 'Damage';
  selected = 'Damage';
  
  el: HTMLElement = document.getElementById('catX');
  
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
 
   updateCatX(){
     const catxVal : CatXValues = {
      cat_x: this.category_x.value
     }
    //  console.log(catxVal.cat_x);
     return catxVal.cat_x;
   }
   onSelect(e: ChartEvent){
     console.log(this.data[e[0].row[2]])
   }
  constructor(private docservice:SearchSpaceService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.docservice.docXY().add(() => {
      console.log(this.updateCatX());
      this.dataSource =  new MatTableDataSource<XY>(this.docservice.comparison);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      var x = this.updateCatX();
      // const x = 'Damage';
      const y = 'Publication Date';
      
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
          }
        }
        // else if(x == 'Infrastructure' && y == 'Publication Date'){
        //   for(let i = 0; i<this.dataSource.filteredData.length;i++){
        //     if(!map.has(String(this.dataSource.filteredData[i].infrastructure_type))){
        //       key = String(this.dataSource.filteredData[i].infrastructure_type);
        //       rowx.push(key);
        //       value = this.dataSource.filteredData[i].publication_date.substr(0,4);
        //       map.set(key,new Array(value));
        //     }
        //     else{
        //       map.get(String(this.dataSource.filteredData[i].infrastructure_type)).push(this.dataSource.filteredData[i].publication_date.substr(0,4));
        //     } 
        //   }
        // }
        // else if(x == 'Tag' && y == 'Publication Date'){
        //   for(let i = 0; i<this.dataSource.filteredData.length;i++){
        //     if(!map.has(String(this.dataSource.filteredData[i].tag))){
        //       key = String(this.dataSource.filteredData[i].tag);
        //       rowx.push(key);
        //       value = this.dataSource.filteredData[i].publication_date.substr(0,4);
        //       map.set(key,new Array(value));
        //     }
        //     else{
        //       map.get(String(this.dataSource.filteredData[i].tag)).push(this.dataSource.filteredData[i].publication_date.substr(0,4));
        //     } 
        //   }
        // }

        // else if(x == 'Damage' && y == 'Incident Date'){
        //   for(let i = 0; i<this.dataSource.filteredData.length;i++){
        //     if(!map.has(String(this.dataSource.filteredData[i].damage_type))){
        //       key = String(this.dataSource.filteredData[i].damage_type);
        //       rowx.push(key);
        //       value = this.dataSource.filteredData[i].incident_date.substr(0,4);
        //       map.set(key,new Array(value));
        //     }
        //     else{
        //       map.get(String(this.dataSource.filteredData[i].damage_type)).push(this.dataSource.filteredData[i].incident_date.substr(0,4));
        //     } 
        //   }
        // }
        // else if(x == 'Infrastructure' && y == 'Incident Date'){
        //   for(let i = 0; i<this.dataSource.filteredData.length;i++){
        //     if(!map.has(String(this.dataSource.filteredData[i].infrastructure_type))){
        //       key = String(this.dataSource.filteredData[i].infrastructure_type);
        //       rowx.push(key);
        //       value = this.dataSource.filteredData[i].incident_date.substr(0,4);
        //       map.set(key,new Array(value));
        //     }
        //     else{
        //       map.get(String(this.dataSource.filteredData[i].infrastructure_type)).push(this.dataSource.filteredData[i].incident_date.substr(0,4));
        //     } 
        //   }
        // }
        // else if(x == 'Tag' && y == 'Incident Date'){
        //   for(let i = 0; i<this.dataSource.filteredData.length;i++){
        //     if(!map.has(String(this.dataSource.filteredData[i].tag))){
        //       key = String(this.dataSource.filteredData[i].tag);
        //       rowx.push(key);
        //       value = this.dataSource.filteredData[i].incident_date.substr(0,4);
        //       map.set(key,new Array(value));
        //     }
        //     else{
        //       map.get(String(this.dataSource.filteredData[i].tag)).push(this.dataSource.filteredData[i].incident_date.substr(0,4));
        //     } 
        //   }
        // }
        //gives the count for each value within each type within cat x
        let countsy = []; 
        map.forEach((value: string, key: string) => {
              let countValue = [];
              for(let i = 0; i < value.length; i++){
                countValue[value[i]] = 1 + (countValue[value[i]] || 0);
                if(!rowy.includes(value[i])){
                  rowy.unshift(value[i]);
                }  
              }
              for(let i = 0; i < rowy.length; i++){
                if(countValue[rowy[i]] == null){
                  countValue[rowy[i]] = 0;
                }

              }
              let filteredArr = countValue.filter(function(value){ return value != null;});
              countsy.push(filteredArr);
              
        });
        
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
            // console.log(row);
            index++;
         });
        this.columnNames = [x,y];
        this.data = row;
      }    
    });
  }

}
