import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as jsPDF from 'jspdf';
import {sample_html} from './sample_preview';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  base64Src = '';
  fakeBackend = 'http://localhost:4200/api/documents/view';
  loadingDocument = true;

  doc = new jsPDF('l', 'in', [11, 8]);



  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    var pdf = new jsPDF('p','pt','a4');

    pdf.addHTML(document.body,function() {
    var string = pdf.output('datauristring');
    console.log(string  )
    // $('.preview-pane').attr('src', string);
});
    // this.doc.fromHTML(atob(sample_html), 15, 15, {
    //   'width': 190,
    //   'elementHandlers': specialElementsHandler
    // })

    // this.doc.save('test.pdf')

    // this.route.params.subscribe(params => {
    //   // use params['docId] to get the docID
    //   this.http.get(this.fakeBackend).subscribe(
    //     (response: string) => {
    //       this.base64Src = response;
    //       // Simulate long respone
    //       setTimeout(() => {
    //         this.loadingDocument = !this.loadingDocument;
    //       }, 2000);
    //     }
    //   );
    // });
  }
}
