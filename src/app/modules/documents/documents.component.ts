import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  events: string[] = [];
  formControl = new FormControl();
  locationList: string[] = ['Arecibo', 'Ponce', 'Mayaguez', 'Caguas', 'Cabo Rojo'];
  languageList: string[] = ['English', 'Spanish'];
  structureList: string[] = ['Building', 'Bridge'];
  dmgList: string[] = ['Fire', 'Flooding', 'Broken Sewer'];

  addEvent(type: string, event: MatDatepickerInputEvent<unknown>) {
    this.events.push(`${type}: ${event.value}`);
  }
  constructor(private docservice:SearchSpaceService) { }

  ngOnInit(): void {
    // Smooth scroll up
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
      }, 16);
    this.docservice.getDocuments()
  }
}
