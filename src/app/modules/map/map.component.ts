import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { GoogleChartComponent, ChartEvent } from 'angular-google-charts';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';



interface SearchValues {
  publicationDate: string;
  incidentDate: string;
  infras: string;
  damage: string;
  tags: string;
  language:string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild('map')
  map: GoogleChartComponent;

  dirtyFields = false;

  results: Observable<any>;
  subject = new Subject()

  constructor(private datepipe: DatePipe){}

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

  // Option Forms and Date
  publicationDate = '';
  incidentDate = '';

  infrastructure = new FormControl();
  infrastructureList: string[] = ['Puertos', 'Carreteras', 'Acueductos', 'Hotelera', 'Aviación', 'Marítima'];

  damage = new FormControl();
  damageList: string[] = ['Corrosión', 'Erosión', 'Desgaste', 'Terremoto', 'Huracán', 'Tsunami'];

  tags = new FormControl();
  tagsList: string[] = ['alto voltage', 'sin agua', 'desorganización'];

  language = new FormControl();
  languageList: string[] = ['Any','English', 'Spanish'];


  // Search Values
  searchValues: SearchValues;

  /**
   * Set the fields to be dirty
   */
  setDirty(){
    this.dirtyFields = true;
    const tmpIncidentDate = this.datepipe.transform(this.incidentDate, 'yyyy-MM-dd')
    const tmpPublicationDate = this.datepipe.transform(this.publicationDate, 'yyyy-MM-dd')
    this.searchValues= {
      publicationDate: tmpPublicationDate,
      incidentDate: tmpIncidentDate,
      infras: this.infrastructure.value,
      damage: this.damage.value,
      tags: this.tags.value,
      language: this.language.value
    }
  }

  /**
   * Reload the map with the new values based on the selected search criteria.
   */
  updateMap(){
    this.dirtyFields = false;
    console.log(this.searchValues)
  }


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
