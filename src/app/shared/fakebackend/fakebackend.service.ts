import { base64PDF } from './fake-data/samplePdf';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { CollaboratorRequest } from '../models/searchspace.model';
import { DocumentMetadata } from '../models/searchspace.model';
import { Map } from '../models/searchspace.model';
import { XY } from '../models/searchspace.model';
import { Timeline } from '../models/searchspace.model';

const collaborators: CollaboratorRequest[] = [
  {id: 'aq9zI01ORNE9Okyziblp', first_name: 'Roberto', last_name: 'Guzman', email: 'roberto.guzman3@upr.edu'},
  {id: '66BuIJ0kNTYPDGz405qb', first_name: 'Yomar', last_name: 'Ruiz', email: 'yomar.ruiz@upr.edu'},
  {id: 'W0SUHONPhPrkrvL3ruxj', first_name: 'Jainel', last_name: 'Torres', email: 'jainel.torrer@upr.edu'},
  {id: 'zOHEzUyIKZB3LsAiu2Kb', first_name: 'Alberto', last_name: 'Canela', email: 'alberto.canela@upr.edu'},
  {id: '9XIu1jT96A5qz1Kpl90R', first_name: 'Alejandro', last_name: 'Vasquez', email: 'alejandro.vasquez@upr.edu'},
  {id: '1XIu1jTk6A5qz1Kplp0R', first_name: 'Don', last_name: 'Quijote', email: 'don.quijote@upr.edu'},
];

const dbDocuments: DocumentMetadata[] = [
    {id: 'tPbl1DyxToy1FUHpfcqn', creator: 'Roberto Guzman', title: 'The great Flooding', published: false, location: 'Caguas', publication_date: '2020-01-02',incident_date:'2017-08-03',modification_date:'2020-03-01',infrastructure_type:['Building'], damage_type:['Flooding'], language:'English', tag:['Flood'] },
    {id: 'iO0PxjKJY0FwezeVq943', creator: 'Yomar Ruiz', title: 'The great Shake', published: true, location: 'Mayagüez', publication_date:'2020-02-01',incident_date:'2017-07-03',modification_date:'2020-03-02',infrastructure_type:['Building'], damage_type:['broken sewer'], language:'Spanish', tag:['Earthquake'] },
    {id: 'qkdQoXSmnNeMISTmMP4f', creator: 'Alberto Canela', title: 'The great Rain', published: false, location: 'Cabo Rojo',publication_date: '2019-10-02', incident_date:'2017-08-13',modification_date:'2020-03-03',infrastructure_type:['Building'], damage_type:['Flooding'], language:'Mandarin', tag:['Flood'] },
    {id: 'RYTSBZAiwlAG0t8EOb6B', creator: 'Alejandro Vasquez', title: 'The great Wind', published: true, location:'San Juan', publication_date: '2020-02-03', incident_date:'2017-07-03',modification_date:'2020-03-05',infrastructure_type:['Building'], damage_type:['Flooding'], language:'English', tag:['Hurricane']  },
    {id: 'VzunBYihBS05mpj0U9pP', creator: 'Jainel Torres', title: 'The great Fire', published: true, location: 'Ponce',publication_date:'2019-02-02',incident_date:'2016-08-03',modification_date:'2019-12-01',infrastructure_type:['Building'], damage_type:['Burn'], language:'Spanish', tag:['Fire']  },
];

const mapDocument: Map[] = [
    {id: 'tPbl1DyxToy1FUHpfcqn', title: 'The great Flooding', location: 'Caguas',infrastructure_type:['Building'], damage_type:['Flooding'], tag:['Flood'] },
    {id: 'iO0PxjKJY0FwezeVq943', title: 'The great Shake', location: 'Mayagüez', infrastructure_type:['Building'], damage_type:['broken sewer'], tag:['Earthquake'] },
    {id: 'qkdQoXSmnNeMISTmMP4f', title: 'The great Rain', location: 'Cabo Rojo',infrastructure_type:['Building'], damage_type:['Flooding'], tag:['Flood'] },
    {id: 'RYTSBZAiwlAG0t8EOb6B', title: 'The great Wind', location:'San Juan', infrastructure_type:['Building'], damage_type:['Flooding'], tag:['Hurricane']  },
    {id: 'VzunBYihBS05mpj0U9pP', title: 'The great Fire', location: 'Ponce', infrastructure_type:['Building'], damage_type:['Burn'], tag:['Fire'] },
];

const xyDocument: XY[] = [
    {id: 'tPbl1DyxToy1FUHpfcqn', title: 'The great Flooding', publication_date: '2020-01-02',incident_date:'2017-08-03',infrastructure_type:['Building', 'Energy'], damage_type:['Flooding', 'broken sewer'], tag:['Flood'] },
    {id: 'iO0PxjKJY0FwezeVq943', title: 'The great Shake',  publication_date:'2020-02-01',incident_date:'2017-07-03',infrastructure_type:['Transportation', 'Building'], damage_type:['broken sewer'],tag:['Earthquake', 'Tsunami'] },
    {id: 'qkdQoXSmnNeMISTmMP4f', title: 'The great Rain', publication_date: '2019-10-02', incident_date:'2010-08-13',infrastructure_type:['Building', 'Water'], damage_type:['Flooding', 'Fire'], tag:['Flood'] },
    {id: 'RYTSBZAiwlAG0t8EOb6B', title: 'The great Wind', publication_date: '2020-02-03', incident_date:'2018-07-03',infrastructure_type:['Energy'], damage_type:['Flooding'], tag:['Hurricane']  },
    {id: 'VzunBYihBS05mpj0U9pP', title: 'The great Story', publication_date:'2018-02-02',incident_date:'2016-08-20',infrastructure_type:['Building'], damage_type:['Fallen Structure'], tag:['Tornado']  },
    {id: 'VzunBKHhBSl5mpj0U9pP', title: 'The great Mind', publication_date:'2016-09-02',incident_date:'2014-08-10',infrastructure_type:['Water', 'Energy'], damage_type:['Burn'], tag:['Tsunami', 'Fire']  },
    {id: 'VzunaoihBS05mpsgU9pP', title: 'The great Place', publication_date:'2017-02-02',incident_date:'2015-07-19',infrastructure_type:['Water'], damage_type:['Burn'], tag:['Fire']  },
    {id: 'VzunBYihBS05mpsJW9pP', title: 'The great Fall', publication_date:'2019-02-02',incident_date:'2012-01-03',infrastructure_type:['Building', 'Water'], damage_type:['Burn', 'Flooding'], tag:['Fire', 'Tornado']  },
    {id: 'Vzun980hBS05mpj0U9pP', title: 'The great Structure', publication_date:'2015-02-02',incident_date:'2011-04-12',infrastructure_type:['Structure'], damage_type:['Burn'], tag:['Fire']  },
    {id: 'HHkwBYihBS05mpj0U9pP', title: 'The great Port', publication_date:'2017-02-02',incident_date:'2015-05-11',infrastructure_type:['Energy'], damage_type:['Fallen Structure', 'Crack'], tag:['Fire', 'Earthquake']  },
];

const timelineDocument: Timeline[] = [
    {id: 'tPbl1DyxToy1FUHpfcqn', title: 'The great Flooding', timeline: [{event:'it flooded', eventDate:'2017-07-09'}] },
    {id: 'iO0PxjKJY0FwezeVq943', title: 'The great Shake', timeline: [{event:'the ground shake', eventDate:'2016-01-09'}]  },
    {id: 'qkdQoXSmnNeMISTmMP4f', title: 'The great Rain', timeline: [{event:'it rained', eventDate:'2017-09-09'}]  },
    {id: 'RYTSBZAiwlAG0t8EOb6B', title: 'The great Wind', timeline: [{event:'it rained with wind', eventDate:'2017-07-10'}]   },
    {id: 'VzunBYihBS05mpj0U9pP', title: 'The great Fire', timeline: [{event:'it burned a lot', eventDate:'2018-07-09'}]},
];


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body, params } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/collab-request') && method === 'GET':
                    return collabRequest();
                case url.endsWith('/api/documents') && method === 'GET':
                    return getDocuments();
                case url.endsWith('/api/documents/{doc_id}') && method === 'GET':
                    return getDocument();      
                case url.endsWith('/documents/visualize/map') && method === 'GET':
                    return docMap();
                case url.endsWith('/documents/visualize/comparison-graph') && method === 'GET':
                    return docXY();
                case url.endsWith('/documents/visualize/timeline') && method === 'GET':
                    return docTimeline();
                default:
                    return next.handle(request);
            }
        }

        // Collaborators
        function collabRequest() {
            console.log(collaborators);
            return ok(collaborators);
        }
        //documents
        function getDocuments() {
            console.log(dbDocuments);
            return ok(dbDocuments);
        }
        function getDocument() {
            return ok(base64PDF);
        }
        

        function docMap() {
            console.log(mapDocument);
            return ok(mapDocument);
        }

        function docXY() {
            console.log(xyDocument);
            return ok(xyDocument);
          }

        function docTimeline() {
            console.log(timelineDocument);
            return ok(timelineDocument);
          }  

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};