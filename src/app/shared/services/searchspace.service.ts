import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentMetadata } from '../models/searchspace.model';
import { CollaboratorRequest } from '../models/searchspace.model';
import { Map } from '../models/searchspace.model';
import { XY } from '../models/searchspace.model';
import { Timeline } from '../models/searchspace.model';



@Injectable({
  providedIn: 'root'
})
export class SearchSpaceService {

  fakeBackend = 'http://localhost:4200/api';
  collaboratorsReq: CollaboratorRequest[];
  documents: DocumentMetadata[];
  maps: Map[];
  comparison: XY[];
  timeline: Timeline[];

  constructor(private http: HttpClient) { }

  collabRequest() {
    /**
     * Get all requests for collaborators from the fake server.
     */
    return this.http.get(`${this.fakeBackend}/collab-request`).subscribe(
      (response: CollaboratorRequest[]) => {
        this.collaboratorsReq = response;
      });
  }
  getDocuments(){
      /**
     * Get all documents from the fake server.
     */
    return this.http.get('http://localhost:4200/api/documents').subscribe(
        (response: DocumentMetadata[]) => {
          this.documents = response;
        });
  }
  getDocumentById(id: string) {
    return;
  }

  docMap(){
    /**
   * Get all documents  from the fake server.
   */
  return this.http.get(`${this.fakeBackend}/documents/visualize/map`).subscribe(
    (response: Map[]) => {
      this.maps = response;
    });
  }
  docXY(){
      /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${this.fakeBackend}/documents/visualize/comparison-graph`).subscribe(
      (response: XY[]) => {
        this.comparison = response;
      });
  }

  docTimeline(){
      /**
     * Get all documents from the fake server.
     */
    return this.http.get(`${this.fakeBackend}/documents/visualize/timeline`).subscribe(
      (response: Timeline[]) => {
        this.timeline = response;
      });
  }

}