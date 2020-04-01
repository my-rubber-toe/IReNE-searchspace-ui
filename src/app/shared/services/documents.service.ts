import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentMetadata } from '../Models/searchspace.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  fakeBackend = 'http://localhost:4200/api';

  documents: DocumentMetadata[];

  constructor(private http: HttpClient) { }

  getDocuments() {
    /**
     * Get all documents with their needed data.
     */

    return this.http.get(`${this.fakeBackend}/documents`).subscribe(
      (response: DocumentMetadata[]) => {
        this.documents = response;
      }
    );
  }
}

