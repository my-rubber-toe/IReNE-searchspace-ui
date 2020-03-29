import { Component, OnInit } from '@angular/core';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private docservice:SearchSpaceService) { }

  ngOnInit(): void {
    this.docservice.getDocuments()
    this.docservice.collabRequest()
    this.docservice.docMap()
    this.docservice.docXY()
    this.docservice.docTimeline()
  }

}
