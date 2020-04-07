import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DocumentMetadata, Filters} from '../models/searchspace.model';
import { CollaboratorRequest } from '../models/searchspace.model';
import { Map } from '../models/searchspace.model';
import { XY } from '../models/searchspace.model';
import { Timeline } from '../models/searchspace.model';
import {SocialUser} from 'angularx-social-login';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class SearchSpaceService {

  fakeBackend = 'http://localhost:4200/api';
  collaboratorsReq: CollaboratorRequest[];
  documents: DocumentMetadata[];
  filters: Filters[];
  maps: Map[];
  comparison: XY[];
  timeline: Timeline[];
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  getDocuments() {
    /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${this.fakeBackend}/documents`).subscribe(
      (response: DocumentMetadata[]) => {
        this.documents = response;
      });
  }
  getDocumentById(id: string) {
    this.http.get(`${this.fakeBackend}/documents/{{doc_id}}`).subscribe(
      (response: DocumentMetadata[]) => {
        this.documents = response;
      });
  }
  getFilters() {
    return this.http.get(`${this.fakeBackend}/api/filters`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  docMap() {
    /**
     * Get all documents  from the fake server.
     */
    return this.http.get(`${this.fakeBackend}/documents/visualize/map`).subscribe(
      (response: Map[]) => {
        this.maps = response;
      });
  }
  docXY() {
      /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${this.fakeBackend}/documents/visualize/comparison-graph`).subscribe(
      (response: XY[]) => {
        this.comparison = response;
      });
  }


  docTimeline() {
      /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${this.fakeBackend}/documents/visualize/timeline`).subscribe(
      (response: Timeline[]) => {
        this.timeline = response;
      });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}

