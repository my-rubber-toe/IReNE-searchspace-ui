import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DocumentMetadata, Filters} from '../models/searchspace.model';
import { CollaboratorRequest } from '../models/searchspace.model';
import { MapMetadata } from '../models/searchspace.model';
import { XY } from '../models/searchspace.model';
import { Timeline } from '../models/searchspace.model';
import { BehaviorSubject} from 'rxjs';
import {Observable, of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchSpaceService {


  fakeBackend = 'http://localhost:8080/api';
  collaboratorsReq: CollaboratorRequest[];
  documents: DocumentMetadata[];
  filters: Filters[];
  maps: MapMetadata[];
  mapFilters: Filters;
  comparison: XY[];
  timeline: Timeline[];
  private behaveX = new BehaviorSubject<Object>({textVal: 'Damage'});
  private behaveY = new BehaviorSubject<Object>({textVal: 'Publication Date'});
  private behaveCS = new BehaviorSubject<Object>({textVal: 'hello'});
  constructor(private http: HttpClient) { }
  setBehaviorViewX(behaveX: Object) {
    this.behaveX.next(behaveX);
  }
  getBehaviorViewX(): Observable<any> {
      return this.behaveX.asObservable();
  }
  setBehaviorViewCS(behaveCS: Object) {
    this.behaveCS.next(behaveCS);
  }
  getBehaviorViewCS(): Observable<any> {
    return this.behaveCS.asObservable();
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
  /**
   * Get all documents metadata from the fake server.
   */
  getDocuments() {
    return this.http.get(`${this.fakeBackend}/documents`).subscribe(
      (response: DocumentMetadata[]) => {
        this.documents = response;
      });
  }

  /**
   * Get the document that has the corresponding id
   * @param id Id of the document to get
   */
  getDocumentById(id: string) {
    this.http.get(`${this.fakeBackend}/documents/{{doc_id}}`).subscribe(
      (response: DocumentMetadata[]) => {
        this.documents = response;
      });
  }

  /**
   * Get the possibles filters of every category to use
   */
  getFilters() {
    return this.http.get(`${this.fakeBackend}/api/filters`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  getMapFilters() {
    return this.http.get(`${this.fakeBackend}/api/map/filters`).subscribe(
      (filters: Filters) => {
        this.mapFilters = filters;
      }
    ); }

  /**
   * Get the possibles filters of tags category to use
   */
  getTagFilters() {
    return this.http.get(`${this.fakeBackend}/api/filters/tags`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  /**
   * Get the possibles filters of infrastructures category to use
   */
  getInfraFilters() {
    return this.http.get(`${this.fakeBackend}/api/filters/infrastructures`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  /**
   * Get the possibles filters of Damages category to use
   */
  getDamageFilters() {
    return this.http.get(`${this.fakeBackend}/api/filters/damages`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  /**
   * Get the possibles filters of Authors category to use
   */
  getAuthorFilters() {
    return this.http.get(`${this.fakeBackend}/api/filters/authors`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  docXY() {
      /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${this.fakeBackend}/visualize/comparison-graph`).subscribe(
      (response: XY[]) => {
        this.comparison = response;
      });
  }


  docTimeline() {
      /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${this.fakeBackend}/visualize/timeline`).subscribe(
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

