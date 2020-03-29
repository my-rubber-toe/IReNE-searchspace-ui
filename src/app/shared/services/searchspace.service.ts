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
    return this.http.get(`${this.fakeBackend}/api/documents`).subscribe(
        (response: DocumentMetadata[]) => {
          this.documents = response;
        });
  }
  getDocumentById(id: string) {
    return;
  }

  docMap(){
    /**
   * Get all documents with filter from the fake server.
   */
  return this.http.get(`${this.fakeBackend}/documents/visualize/map`).subscribe(
    (response) => {
        this.maps.forEach(e => {
          if(e.id === response){
             response = e;
          }
          else if(e.damage_type === response){
            response = e;
         }
          else if(e.infrastructure_type === response){
             response = e;
         }
         else if(e.tag === response){
            response = e;
         }
         else if(e.location === response){
            response = e;
         }
        });
      }
    );
}
docXY(){
    /**
   * Get all documents with filter from the fake server.
   */
  return this.http.get(`${this.fakeBackend}/documents/visualize/comparison-graph`).subscribe(
    (response) => {
        this.comparison.forEach(e => {
          if(e.id === response){
             response = e;
          }
          else if(e.damage_type === response){
            response = e;
         }
          else if(e.infrastructure_type === response){
             response = e;
         }
         else if(e.tag === response){
            response = e;
         }
         else if(e.publication_date === response){
            response = e;
         }
         else if(e.incident_date === response){
             response = e;
         }
        });
      }
    );
}

docTimeline(){
    /**
   * Get all documents with filter from the fake server.
   */
  return this.http.get(`${this.fakeBackend}/documents/visualize/timeline`).subscribe(
    (response) => {
        this.timeline.forEach(e => {
          if(e.id === response){
             response = e;
          }
          else if(e.title === response){
            response = e;
         }
          else if(e.timeline === response){
             response = e;
         }
        });
      }
    );
}

}