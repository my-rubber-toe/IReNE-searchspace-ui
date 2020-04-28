import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DocumentMetadata, Filters} from '../models/searchspace.model';
import { CollaboratorRequest } from '../models/searchspace.model';
import { MapMetadata } from '../models/searchspace.model';
import { XY } from '../models/searchspace.model';
import { Timeline } from '../models/searchspace.model';
import { BehaviorSubject} from 'rxjs';
import {Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SearchSpaceService {
  /**
   * Initial Headers for http requests from this service
   */
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset-utf-8', Accept: 'application/json'}),
  };
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
  /**
   * Get all documents metadata from the fake server.
   */
  getDocuments() {
    return this.http.get(`${environment.base_url}documents/`, this.httpOptions).subscribe(
      (response: DocumentMetadata[]) => {
        this.documents = response[`message`];
      });
  }

  /**
   * Get the document that has the corresponding id
   * @param id Id of the document to get
   */
  getDocumentById(id: string) {
    this.http.get<DocumentMetadata[]>(`${environment.base_url}documents/{{doc_id}}`).subscribe(
      (response: DocumentMetadata[]) => {
        this.documents = response;
      });
  }

  /**
   * Get the possibles filters of every category to use
   */
  getFilters() {
    return this.http.get(`${environment.base_url}filters`).subscribe(
      (response: Filters[]) => {
        this.filters = response[`message`];
      }
    );
  }

  getMapFilters() {
    return this.http.get(`${environment.base_url}map/filters`).subscribe(
      (filters: Filters) => {
        this.mapFilters = filters;
      }
    ); }

  /**
   * Get the possibles filters of tags category to use
   */
  getTagFilters() {
    return this.http.get(`${environment.base_url}filters/tags`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  /**
   * Get the possibles filters of infrastructures category to use
   */
  getInfraFilters() {
    return this.http.get(`${environment.base_url}filters/infrastructures`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  /**
   * Get the possibles filters of Damages category to use
   */
  getDamageFilters() {
    return this.http.get(`${environment.base_url}filters/damages`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  /**
   * Get the possibles filters of Authors category to use
   */
  getAuthorFilters() {
    return this.http.get(`${environment.base_url}filters/authors`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  docXY() {
      /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${environment.base_url}visualize/comparison-graph`).subscribe(
      (response: XY[]) => {
        this.comparison = response[`message`];
      });
  }


  docTimeline() {
      /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${environment.base_url}visualize/timeline`).subscribe(
      (response: Timeline[]) => {
        this.timeline = response[`message`];
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

