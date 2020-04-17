import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {encoded_html} from './test_encoded_html';

// Import CKEditor5-build-classic
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
  incidentDate: string;
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
  fakeBackend = 'http://localhost:4200/api/documents/view';
  loadingDocument = true;
  notFound = false;

  // Force the CSS to load the Classic editor CSS values.
  public editor = ClassicEditor;

  title: string = '';
  description: string = '';
  creatorFullName: string = '';
  creatorEmail: string = '';
  publicationDate: string = '';
  lastModifiedDate: string = '';
  incidentDate: string = '';
  infraList: Array<String> = [];
  damageList: Array<String> = [];
  tagList: Array<String> = [];
  authorList: Array<Author> = [];
  actorList: Array<Actor> = [];
  sectionList: Array<Section> = [];

  ckeditorData: SafeHtml = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {
    
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {

      // use params['docId] to get the docID
      let body = {
        id: params['docId']
      }
      
      this.http.post(this.fakeBackend, body).subscribe(
        (response: Document) => {
          
          this.title = response.title;
          this.description = response.description
          this.creatorFullName = response.creatorFullName;
          this.creatorEmail = response.creatorEmail;
          this.publicationDate = this.datePipe.transform(response.publicationDate, 'yyyy-MM-dd');
          this.lastModifiedDate = this.datePipe.transform(response.lastModifiedDate, 'yyyy-MM-dd')
          this.incidentDate = this.datePipe.transform(response.incidentDate, 'yyyy-MM-dd')
          this.infraList = response.infraList;
          this.damageList = response.damageList;
          this.tagList = response.tagList;
          this.authorList = response.authorList;
          this.actorList = response.actorList;
          this.sectionList = response.sectionList

          this.ckeditorData = this.sanitizer.bypassSecurityTrustHtml(atob(encoded_html));

          // Simulate long respone
          setTimeout(() => {
            this.loadingDocument = false;
          }, 1500);
        },
        (error) =>{
          setTimeout(() => {
            this.loadingDocument = false;
          }, 1500);
          this.loadingDocument = false;
          this.notFound = true;
        }
      );
    });
  }
}