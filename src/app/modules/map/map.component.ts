import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { GoogleChartComponent, ChartEvent } from 'angular-google-charts';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';



interface SearchValues {
  infras: string;
  damage: string;
  tags: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild('map')
  map: GoogleChartComponent;

  results: Observable<any>;
  subject = new Subject()

  constructor(){}

  ngOnInit(){
    let scrollToTop = window.setInterval(() => {
    let pos = window.pageYOffset;
    if (pos > 0) {
        window.scrollTo(0, pos - 30); // how far to scroll on each step
    } else {
        window.clearInterval(scrollToTop);
    }
    }, 16);

    this.results = this.subject.pipe(debounceTime(1000), map((searchValues: SearchValues) => console.log(searchValues)))
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
    enableScrollWheel: true
  };
  width = window.innerWidth - 18;
  height = 600;

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

  updateMapValues(e){
    const searchValues: SearchValues = {
      infras: this.infrastructure.value,
      damage: this.damage.value,
      tags: this.tags.value
    }
    this.subject.next(searchValues)
  }

}
