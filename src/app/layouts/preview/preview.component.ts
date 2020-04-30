import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {encoded_html} from './test_encoded_html';

// Import CKEditor5-build-classic
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { environment } from 'src/environments/environment';


interface Author {
  author_FN: string;
  author_LN: string;
  author_email: string;
  author_faculty: string;
}

interface Actor {
  actor_FN: string;
  actor_LN: string;
  role: string;
}

interface Section {
  secTitle: string;
  content: string;
}

interface Document {
  title: string;
  description: string;
  creatorFullName: string;
  creatorEmail: string;
  creationDate: string;
  lastModificationDate: string;
  incidentDate: string;
  infrasDocList: Array<string>;
  damageDocList: Array<string>;
  tagsDoc: Array<string>;
  author: Array<Author>;
  actor: Array<Actor>;
  section: Array<Section>;
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
  creationDate: string = '';
  lastModificationDate: string = '';
  incidentDate: string = '';
  infrasDocList: Array<String> = [];
  damageDocList: Array<String> = [];
  tagsDoc: Array<String> = [];
  author: Array<Author> = [];
  actor: Array<Actor> = [];
  section: Array<Section> = [];

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
      const id = params[`docId`];
      this.http.get(`${environment.serverUrl}/documents/view/` + id).subscribe(
        (response: Document) => {
          const doc = response[`message`];
          this.title = doc.title;
          this.description = doc.description;
          this.creatorFullName = doc.creatorFullName;
          this.creatorEmail = doc.creatorEmail;
          this.creationDate = this.datePipe.transform(doc.creationDate, 'yyyy-MM-dd');
          this.lastModificationDate = this.datePipe.transform(doc.lastModificationDate, 'yyyy-MM-dd');
          this.incidentDate = this.datePipe.transform(doc.incidentDate, 'yyyy-MM-dd');
          this.infrasDocList = doc.infrasDocList;
          this.damageDocList = doc.damageDocList;
          this.tagsDoc = doc.tagsDoc;
          this.author = doc.author;
          this.actor = doc.actor;
          this.section = doc.section;

          this.ckeditorData = this.sanitizer.bypassSecurityTrustHtml(atob(encoded_html));

          // Simulate long respone
//         setTimeout(() => {
//           this.loadingDocument = false;
//         }, 1500);
          this.loadingDocument = false;
        },
        (error) => {
//          setTimeout(() => {
//            this.loadingDocument = false;
//          }, 1500);
          this.loadingDocument = false;
          this.notFound = true;
        }
      );
    });
  }
}
