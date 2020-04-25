import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl} from '@angular/forms';
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
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  tempEvent: Event;
  dataSource: MatTableDataSource<XY>;
  tempDataSource: MatTableDataSource<XY>;
  events: string[] = [];
  category_x = new FormControl();
  categoryX: string[] = ['Infrastructure', 'Damage', 'Tag'];

  category_y = new FormControl();
  categoryY: string[] = ['Number of Cases', 'Incident Date', 'Publication Date'];

  //title and columnNames is filled in ngonInit()
  title = '';
  type = 'BarChart';
   columnNames = [];
   options = {
    enableScrollWheel:true,
    showTip:true,
    isStacked:true,

   };
   //data is filled in ngonInit()
   data = [];
   width = 750;
   height = 550;

   //sends the value to use in ngoninit()
   sendValueX(value) {
    this.docservice.setBehaviorViewX({textVal: value});
    }
   sendValueY(value) {
    this.docservice.setBehaviorViewY({textVal: value});
    }
    //gets the value from html
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
  constructor(private docservice:SearchSpaceService) { }

  ngOnInit(): void {
    this.docservice.getBehaviorViewX().subscribe(vx => {
    this.docservice.getBehaviorViewY().subscribe(vy => {
    this.docservice.docXY().add(() => {
      this.dataSource =  new MatTableDataSource<XY>(this.docservice.comparison);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      //values from the selection of category x & y
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
            for(let j = 0; j < this.dataSource.filteredData[i].damageDocList.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].damageDocList[j]))){
                key = String(this.dataSource.filteredData[i].damageDocList[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].creationDate.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].damageDocList[j])).push(this.dataSource.filteredData[i].creationDate.substr(0,4));
              }
            }
            //gets the distinct category y
            if(!rowy.includes(this.dataSource.filteredData[i].creationDate.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].creationDate.substr(0,4));
            }
          }
        }
        else if(x == 'Infrastructure' && y == 'Publication Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            for(let j = 0; j < this.dataSource.filteredData[i].infrasDocList.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].infrasDocList[j]))){
                key = String(this.dataSource.filteredData[i].infrasDocList[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].creationDate.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].infrasDocList[j])).push(this.dataSource.filteredData[i].creationDate.substr(0,4));
              }
            }
            //gets the distinct category y
            if(!rowy.includes(this.dataSource.filteredData[i].creationDate.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].creationDate.substr(0,4));
            }
          }
        }
        else if(x == 'Tag' && y == 'Publication Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            for(let j = 0; j < this.dataSource.filteredData[i].tagsDoc.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].tagsDoc[j]))){
                key = String(this.dataSource.filteredData[i].tagsDoc[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].creationDate.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].tagsDoc[j])).push(this.dataSource.filteredData[i].creationDate.substr(0,4));
              }
            }
            //gets the distinct category y
            if(!rowy.includes(this.dataSource.filteredData[i].creationDate.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].creationDate.substr(0,4));
            }
          }
        }

        else if(x == 'Damage' && y == 'Incident Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            for(let j = 0; j < this.dataSource.filteredData[i].damageDocList.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].damageDocList[j]))){
                key = String(this.dataSource.filteredData[i].damageDocList[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].incidentDate.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].damageDocList[j])).push(this.dataSource.filteredData[i].incidentDate.substr(0,4));
              }
            }
            //gets the distinct category y
            if(!rowy.includes(this.dataSource.filteredData[i].incidentDate.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].incidentDate.substr(0,4));
            }
          }
          console.log(map);
        }
        else if(x == 'Infrastructure' && y == 'Incident Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            for(let j = 0; j < this.dataSource.filteredData[i].infrasDocList.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].infrasDocList[j]))){
                key = String(this.dataSource.filteredData[i].infrasDocList[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].incidentDate.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].infrasDocList[j])).push(this.dataSource.filteredData[i].incidentDate.substr(0,4));
              }
            }
            //gets the distinct category y
            if(!rowy.includes(this.dataSource.filteredData[i].incidentDate.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].incidentDate.substr(0,4));
            }
          }
        }
        else if(x == 'Tag' && y == 'Incident Date'){
          for(let i = 0; i<this.dataSource.filteredData.length;i++){
            for(let j = 0; j < this.dataSource.filteredData[i].tagsDoc.length; j++){
              if(!map.has(String(this.dataSource.filteredData[i].tagsDoc[j]))){
                key = String(this.dataSource.filteredData[i].tagsDoc[j]);
                rowx.push(key);
                value = this.dataSource.filteredData[i].incidentDate.substr(0,4);
                map.set(key,new Array(value));
              }
              else{
                map.get(String(this.dataSource.filteredData[i].tagsDoc[j])).push(this.dataSource.filteredData[i].incidentDate.substr(0,4));
              }
            }
            //gets the distinct category y
            if(!rowy.includes(this.dataSource.filteredData[i].incidentDate.substr(0,4))){
              rowy.unshift(this.dataSource.filteredData[i].incidentDate.substr(0,4));
            }
          }
        }
        //gives the count for each value within each type within cat x
        rowy = rowy.sort();
        let countsy = [];
        map.forEach((value: string, key: string) => {
              let countValue = [];
              for(let i = 0; i < value.length; i++){
                //fills an array with length of the year
                //this is to have a sort of count per year
                countValue[value[i]] = 1 + (countValue[value[i]] || 0);
              }
              //the category x that doesn't have a certain value from category y is put a 0
              //this way that year will have a count of 0 documents
              for(let i = 0; i < rowy.length; i++){
                if(countValue[rowy[i]] == null){
                  countValue[rowy[i]] = 0;
                }

              }
              //returns an array with no null values
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
        this.data = row;
        console.log('x: ',x,'y:',y);
        console.log('data:\n',this.data);
        this.title = 'Comparison Graph \n Where: \n X = ' + x + " & Y = " + y;
      }
      else {
          //the hash map here is built with category x as key and value as ocurrecences of catX
          if(x == "Damage"){
            for(let i = 0; i<this.dataSource.filteredData.length;i++){
              for(let j = 0; j < this.dataSource.filteredData[i].damageDocList.length; j++){
                  if(!map.has(String(this.dataSource.filteredData[i].damageDocList[j]))){
                    key = String(this.dataSource.filteredData[i].damageDocList[j]);
                    map.set(key, 1);
                  }
                  else{
                    map.set(String(this.dataSource.filteredData[i].damageDocList[j]), map.get(String(this.dataSource.filteredData[i].damageDocList[j])) + 1);
                  }
               }
             }
          }
          else if(x == "Infrastructure"){
            for(let i = 0; i<this.dataSource.filteredData.length;i++){
              for(let j = 0; j < this.dataSource.filteredData[i].infrasDocList.length; j++){
                  if(!map.has(String(this.dataSource.filteredData[i].infrasDocList[j]))){
                    key = String(this.dataSource.filteredData[i].infrasDocList[j]);
                    map.set(key, 1);
                  }
                  else{
                    map.set(String(this.dataSource.filteredData[i].infrasDocList[j]), map.get(String(this.dataSource.filteredData[i].infrasDocList[j])) + 1);
                  }
               }
             }
          }
          else if(x == "Tag"){
            for(let i = 0; i<this.dataSource.filteredData.length;i++){
              for(let j = 0; j < this.dataSource.filteredData[i].tagsDoc.length; j++){
                  if(!map.has(String(this.dataSource.filteredData[i].tagsDoc[j]))){
                    key = String(this.dataSource.filteredData[i].tagsDoc[j]);
                    map.set(key, 1);
                  }
                  else{
                    map.set(String(this.dataSource.filteredData[i].tagsDoc[j]), map.get(String(this.dataSource.filteredData[i].tagsDoc[j])) + 1);
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
        console.log('x: ',x,'y:',y);
        console.log('data:\n',this.data);
        this.title = 'Comparison Graph \n Where: \n X = ' + x + " & Y = " + y;
      }
    });
  });
 });
  }

}
