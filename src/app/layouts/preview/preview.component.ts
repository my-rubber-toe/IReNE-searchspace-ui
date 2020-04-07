import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  base64Src = '';
  fakeBackend = 'http://localhost:4200/api/documents/view';
  loadingDocument = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // use params['docId] to get the docID
      this.http.get(this.fakeBackend).subscribe(
        (response: string) => {
          this.base64Src = response;
          // Simulate long respone
          setTimeout(() => {
            this.loadingDocument = !this.loadingDocument;
          }, 2000);
        }
      );
    });
  }
}
