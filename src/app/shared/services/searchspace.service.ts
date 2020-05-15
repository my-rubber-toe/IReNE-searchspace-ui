import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {DocumentMetadata, Filters, MapMetadata, Timeline, XY} from '../models/searchspace.model';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SearchSpaceService {
  documents: DocumentMetadata[];
  map: MapMetadata[];
  filters: Filters[];
  maps: MapMetadata[];
  mapFilters: Filters;
  comparison: XY[];
  timeline: Timeline[];
  /**
   * Initial Headers for http requests from this service
   */
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json; charset-utf-8', Accept: 'application/json'}),
    reportProgress: true,
  };
  private behaveX = new BehaviorSubject<Object>({textVal: 'Damage'});
  private behaveY = new BehaviorSubject<Object>({textVal: 'Publication Date'});
  private behaveCS = new BehaviorSubject<Object>({textVal: 'title'});
  private TimelineCat = new BehaviorSubject<Object>({
    infrasDocList: 'Building',
    damageDocList: 'Earthquake'
  });

  constructor(private http: HttpClient) {
  }

  setBehaviorViewTCAT(TimelineCat: Object) {
    this.TimelineCat.next(TimelineCat);
  }

  getBehaviorViewTCAT(): Observable<any> {
    return this.TimelineCat.asObservable();
  }

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
   * Get all documents metadata following the DocumentsMetadata interface(See models documentation) from the backend server.
   * Returns the a Request observable for the responses with the http events
   */
  getDocuments() {
    const req = new HttpRequest('GET', `${environment.serverUrl}/documents/`, this.httpOptions);
    return this.http.request(req);
  }
  /**
   * Get all documents metadata following the MapMetadata interface(See models documentation) from the backend server.
   */
  getMapDocuments() {
    return this.http.get(`${environment.serverUrl}/visualize/map/`, this.httpOptions).subscribe(
      (response: MapMetadata[]) => {
        this.map = response[`message`];
      });
  }

  /**
   * Get the possibles filters of every category to use following the Filters Interface(See models documentation)
   */
  getFilters() {
    return this.http.get(`${environment.serverUrl}/filters/`).subscribe(
      (response: Filters[]) => {
        this.filters = response[`message`];
      }
    );
  }

  /**
   * @ignore
   */
  getMapFilters() {
    return this.http.get(`${environment.serverUrl}/map/filters/`).subscribe(
      (filters: Filters) => {
        this.mapFilters = filters;
      }
    );
  }

  /**
   * Get the possibles filters of tags category to use
   */
  getTagFilters() {
    return this.http.get(`${environment.serverUrl}/filters/tags/`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  /**
   * Get the possibles filters of infrastructures category to use
   */
  getInfraFilters() {
    return this.http.get(`${environment.serverUrl}/filters/infrastructures/`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  /**
   * Get the possibles filters of Damages category to use
   */
  getDamageFilters() {
    return this.http.get(`${environment.serverUrl}/filters/damages/`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  /**
   * Get the possibles filters of Authors category to use
   */
  getAuthorFilters() {
    return this.http.get(`${environment.serverUrl}/filters/authors/`).subscribe(
      (response: Filters[]) => {
        this.filters = response;
      }
    );
  }

  docXY() {
    /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${environment.serverUrl}/visualize/comparison-graph/`).subscribe(
      (response: XY[]) => {
        this.comparison = response[`message`];
      });
  }


  docTimeline() {
    /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${environment.serverUrl}/visualize/timeline/`).subscribe(
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

