import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';

@Component({
  selector: 'app-xy',
  templateUrl: './xy.component.html',
  styleUrls: ['./xy.component.scss']
})
export class XyComponent implements OnInit {

  events: string[] = [];
  formControl = new FormControl();
  locationList: string[] = ['Arecibo', 'Ponce', 'Mayaguez', 'Caguas', 'Cabo Rojo'];
  languageList: string[] = ['English', 'Spanish'];
  structureList: string[] = ['Transportation', 'Energy', 'Water', 'Security', 'Ports', 'Structure', 'Construction'];
  dmgList: string[] = ['Fire', 'Flooding', 'Broken Sewer'];

  constructor(private docservice:SearchSpaceService) { }

  ngOnInit(): void {
    this.docservice.getDocuments()
  }

}
