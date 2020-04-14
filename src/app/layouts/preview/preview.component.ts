import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  base64Src = '';
  fakeBackend = 'http://localhost:4200/api/documents/view';
  loadingDocument = true;

  description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda expedita ducimus nemo officiis cum nam recusandae, est omnis similique aliquam, quaerat aperiam tempore, eligendi nulla architecto hic minima labore?"
  creatorFullName = 'Pepito Fulano';
  publicationDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  lastModifiedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  infraList = ["Infra1", "Infra2"]
  damageList = ["Damage1", "Damage2"]
  tagList = ["Tag1", "Tag2", "Tag3"]
  authorList = [
    {
      firstName: 'FirstName',
      lastName: 'LastName',
      email: 'email@email.com',
      faculty: 'ININ'
    },
    {
      firstName: 'FirstName',
      lastName: 'LastName',
      email: 'email@email.com',
      faculty: 'ININ'
    },
    {
      firstName: 'FirstName',
      lastName: 'LastName',
      email: 'email@email.com',
      faculty: 'ININ'
    },
  ]

  actorList = [
    {
      firstName: 'FirstName',
      lastName: 'LastName',
      role: 'somerole'
    },
    {
      firstName: 'FirstName',
      lastName: 'LastName',
      role: 'somerole'
    },
    {
      firstName: 'FirstName',
      lastName: 'LastName',
      role: 'somerole'
    },
  ]

  sectionList = [
    {
      title: "Section Title",
      content: "<h1>This is a text with inner html of H1<h1>"
    },
    {
      title: "Section Title",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda expedita ducimus nemo officiis cum nam recusandae, est omnis similique aliquam, quaerat aperiam tempore, eligendi nulla architecto hic minima labore?"
    },
    {
      title: "Section Title",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda expedita ducimus nemo officiis cum nam recusandae, est omnis similique aliquam, quaerat aperiam tempore, eligendi nulla architecto hic minima labore?"
    },
    {
      title: "Section Title",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda expedita ducimus nemo officiis cum nam recusandae, est omnis similique aliquam, quaerat aperiam tempore, eligendi nulla architecto hic minima labore?"
    }
  ]

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

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
