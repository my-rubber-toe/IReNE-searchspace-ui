import { Component, OnInit } from '@angular/core';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searching = false;
  event1: Event;
  constructor(private docservice:SearchSpaceService) { }

  ngOnInit(): void {
    this.docservice.getDocuments()
    this.docservice.collabRequest()
    this.docservice.docMap()
    this.docservice.docXY()
    this.docservice.docTimeline()
  }

}
