import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { GoogleChartComponent, ChartEvent } from 'angular-google-charts';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild('map')
  map: GoogleChartComponent;

  constructor(){}

  ngOnInit(){

  }

  // Google Map Data Setup
  title = '';
  type = 'Map';
  data = [
    ["Mayaguez, PR", "Titulo", "docId"],
    ["Ponce, PR", "Titulo", "docId"],
    ["Rio Piedras, PR", "Titulo", "docId"],
  ];
  columnNames = ["location","title", "docId"];
  options = {   
    showTip: true,
    scrollwheel: true
  };
  width = window.innerWidth - 18;
  height = 400;

  // Option Forms
  infrastructure = new FormControl();
  infrastructureList: string[] = ['Puertos', 'Carreteras', 'Acueductos', 'Hotelera', 'Aviación', 'Marítima'];

  damage = new FormControl();
  damageList: string[] = ['Corrosión', 'Erosión', 'Desgaste', 'Terremoto', 'Huracán', 'Tsunami'];

  tags = new FormControl();
  tagsList: string[] = ['alto voltage', 'sin agua', 'desorganización'];


  onSelect(e: ChartEvent) {
    console.log(this.data[e[0].row][2])
    console.log(this.infrastructure.value)
  }

  changeMarkers(){
    this.data = [
      ['Mayaguez, PR', "Titulo",  "123456"],
      ['Aguadilla, PR', "Titulo",  "123456"],
      ['Aguada, PR', "Titulo",  "123456"],
      ['Cabo Rojo, PR', "Titulo",  "123456"],
    ]
  }

}
