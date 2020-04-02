import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';


@Component({
  selector: 'app-xy',
  templateUrl: './xy.component.html',
  styleUrls: ['./xy.component.scss']
  // template: `<app-barChart></app-barChart>`
})
export class XyComponent implements OnInit {

  events: string[] = [];
  formControl = new FormControl();
  locationList: string[] = ['Arecibo', 'Ponce', 'Mayaguez', 'Caguas', 'Cabo Rojo'];
  languageList: string[] = ['English', 'Spanish'];
  structureList: string[] = ['Transportation', 'Energy', 'Water', 'Security', 'Ports', 'Structure', 'Construction'];
  dmgList: string[] = ['Fire', 'Flooding', 'Broken Sewer'];
  categoryX: string[] = ['Infrastructure', 'Damager', 'Tag'];
  categoryY: string[] = ['Number of Cases', 'Creation Date', 'Publication Date'];
  //chart
  title = 'Browser market shares at a specific website, 2014';
   type = 'Chart';
   data = [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7] 
   ];
   columnNames = ['Browser', 'Percentage'];
   options = {
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'], is3D: true
   };
   width = 550;
   height = 400;
  constructor(private docservice:SearchSpaceService) { }

  ngOnInit(): void {
    this.docservice.getDocuments()
  }

}
