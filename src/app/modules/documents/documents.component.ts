import { Component, OnInit } from '@angular/core';
import { SearchSpaceService } from 'src/app/shared/services/searchspace.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  constructor(private docservice:SearchSpaceService) { }

  ngOnInit(): void {
    this.docservice.getDocuments()
  }

}
