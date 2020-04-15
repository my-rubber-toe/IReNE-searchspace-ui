import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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
  ckeditorData: SafeHtml = '';

  public editor = ClassicEditor;
  public editorData = '';
  public editorConfig = {
    // width: 768,
    toolbar: [ 'heading', '|', 'bold', 'italic' ],
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {
    
  }

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
          this.publicationDate = this.datePipe.transform(response.publicationDate, 'yyyy-MM-dd');
          this.lastModifiedDate = this.datePipe.transform(response.lastModifiedDate, 'yyyy-MM-dd')
          this.infraList = response.infraList;
          this.damageList = response.damageList;
          this.tagList = response.tagList;
          this.authorList = response.authorList;
          this.actorList = response.actorList;
          this.sectionList = response.sectionList

          // this.editorData += `<h1>${response.title}</h1>`;
          // this.editorData += `<h2>Description:</h2><p>${response.description}</p>`

          // console.log(this.editorData)

          this.ckeditorData = this.sanitizer.bypassSecurityTrustHtml(atob(encoded_html));

          // Simulate long respone
          setTimeout(() => {
            this.loadingDocument = false;
          }, 2000);
        }
      );
    });
  }
}
