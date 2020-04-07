import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DocumentMetadata, Filters} from '../models/searchspace.model';
import { CollaboratorRequest } from '../models/searchspace.model';
import { Map } from '../models/searchspace.model';
import { XY } from '../models/searchspace.model';
import { Timeline } from '../models/searchspace.model';
import { BehaviorSubject} from 'rxjs';
import {Observable, of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchSpaceService {

  constructor(private http: HttpClient) { }

  fakeBackend = 'http://localhost:4200/api';
  collaboratorsReq: CollaboratorRequest[];
  documents: DocumentMetadata[];
  filters: Filters[];
  maps: Map[];
  comparison: XY[];
  timeline: Timeline[];
  private behaveX = new BehaviorSubject<Object>({textVal: 'Damage'});
  private behaveY = new BehaviorSubject<Object>({textVal: 'Publication Date'});
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  setBehaviorViewX(behaveX: Object) {
    this.behaveX.next(behaveX);
  }
  getBehaviorViewX(): Observable<any> {
      return this.behaveX.asObservable();
  }
  setBehaviorViewY(behaveY: Object) {
    this.behaveY.next(behaveY);
  }
  getBehaviorViewY(): Observable<any> {
      return this.behaveY.asObservable();
  }
  collabRequest() {
    /**
     * Get all requests for collaborators from the fake server.
     */
    return this.http.get(`${this.fakeBackend}/collab-request`).subscribe(
      (response: CollaboratorRequest[]) => {
        this.collaboratorsReq = response;
      });
  }
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

