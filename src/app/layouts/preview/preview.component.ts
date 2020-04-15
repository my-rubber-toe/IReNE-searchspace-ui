import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {encoded_html} from './test_encoded_html';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


interface Author {
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
}

interface Actor{
  firstName: string;
  lastName: string;
  role: string;
}

interface Section{
  title: string;
  content: string;
}

interface Document{
  title: string;
  description: string;
  creatorFullName: string;
  creatorEmail: string;
  publicationDate: string;
  lastModifiedDate: string;
  infraList: Array<string>;
  damageList: Array<string>;
  tagList: Array<string>;
  authorList: Array<Author>;
  actorList: Array<Actor>;
  sectionList: Array<Section>;
}

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  base64Src = '';
  fakeBackend = 'http://localhost:4200/api/documents/view';
  loadingDocument = true;

  public Editor = ClassicEditor;

  
  title: string = '';
  description: string = '';
  creatorFullName: string = '';
  creatorEmail: string = '';
  publicationDate: string = '';
  lastModifiedDate: string = '';
  infraList: Array<String> = [];
  damageList: Array<String> = [];
  tagList: Array<String> = [];
  authorList: Array<Author> = [];
  actorList: Array<Actor> = [];
  sectionList: Array<Section> = [];
  complexHtml: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      // use params['docId] to get the docID
      this.http.get(this.fakeBackend).subscribe(
        (response: Document) => {
          console.log(response)
          this.title = response.title;
          this.description = response.description
          this.creatorFullName = response.creatorFullName;
          this.creatorEmail = response.creatorEmail;
          this.publicationDate = this.datePipe.transform(response.publicationDate, 'YYYY-MM-DD')
          this.lastModifiedDate = this.datePipe.transform(response.lastModifiedDate, 'YYYY-MM-DD')
          this.infraList = response.infraList;
          this.damageList = response.damageList;
          this.tagList = response.tagList;
          this.authorList = response.authorList;
          this.actorList = response.actorList;
          this.sectionList = response.sectionList

          this.complexHtml = this.sanitizer.bypassSecurityTrustHtml(atob(encoded_html));

          // Simulate long respone
          setTimeout(() => {
            this.loadingDocument = false;
          }, 2000);
        }
      );
    });
  }
}
