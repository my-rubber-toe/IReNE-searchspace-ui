import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { CollaboratorRequest } from '../models/searchspace.model';
import { DocumentMetadata } from '../models/searchspace.model';
import { MapMetadata } from '../models/searchspace.model';
import { XY } from '../models/searchspace.model';
import { Timeline } from '../models/searchspace.model';
import {Filters} from '../models/searchspace.model';
import { sample_document } from './sample_preview';

//const collaborators: CollaboratorRequest[] = [
//  {id: 'aq9zI01ORNE9Okyziblp', first_name: 'Roberto', last_name: 'Guzman', email: 'roberto.guzman3@upr.edu'},
//  {id: '66BuIJ0kNTYPDGz405qb', first_name: 'Yomar', last_name: 'Ruiz', email: 'yomar.ruiz@upr.edu'},
//  {id: 'W0SUHONPhPrkrvL3ruxj', first_name: 'Jainel', last_name: 'Torres', email: 'jainel.torrer@upr.edu'},
//  {id: 'zOHEzUyIKZB3LsAiu2Kb', first_name: 'Alberto', last_name: 'Canela', email: 'alberto.canela@upr.edu'},
//  {id: '9XIu1jT96A5qz1Kpl90R', first_name: 'Alejandro', last_name: 'Vasquez', email: 'alejandro.vasquez@upr.edu'},
//  {id: '1XIu1jTk6A5qz1Kplp0R', first_name: 'Don', last_name: 'Quijote', email: 'don.quijote@upr.edu'},
//];
//
// const dbDocuments: DocumentMetadata[] = [
//  {id: 'tPbl1DyxToy1FUHpfcqn', authors: ['Roberto Guzman', 'Yomar Ruiz'], title: 'Title 1', published: false, location: 'Caguas, PR', publication_date: '2020-01-02',incident_date:'2017-08-03',modification_date:'2020-03-01',infrastructure_type:['Building'], damage_type: ['Flooding', 'Fire', 'Flooding', 'Fire'], language:'English', tag:['Flood', 'Hurricane'] },
//  {id: 'iO0PxjKJY0FwezeVq943', authors: ['Yomar Ruiz'], title: 'Title 2', published: true, location: 'Mayagüez, PR', publication_date:'2020-02-01',incident_date:'2017-07-03',modification_date:'2020-03-02',infrastructure_type:['Building'], damage_type: ['Broken Sewer'], language:'Spanish', tag:['Earthquake'] },
//  {id: 'qkdQoXSmnNeMISTmMP4f', authors: ['Alberto Canela'], title: 'Title 3', published: false, location: 'Cabo Rojo, PR',publication_date: '2019-10-02', incident_date:'2017-08-13',modification_date:'2020-03-03',infrastructure_type:['Building'], damage_type: ['Flooding'], language:'Mandarin', tag:['Flood'] },
//  {id: 'RYTSBZAiwlAG0t8EOb6B', authors: ['Alejandro Vasquez'], title: 'Title 4', published: true, location:'San Juan, PR', publication_date: '2020-02-03', incident_date:'2017-07-03',modification_date:'2020-03-05',infrastructure_type:['Building'], damage_type:['Flooding'], language:'English', tag:['Hurricane']  },
//  {id: 'VzunBYihBS05mpj0U9pP', authors: ['Jainel Torres'], title: 'Title 5', published: true, location: 'Ponce, PR',publication_date:'2019-02-02',incident_date:'2016-08-03',modification_date:'2019-12-01',infrastructure_type:['Building'], damage_type:['Burn'], language:'Spanish', tag:['Fire'] },
//  {id: 'tPbl1DyxToy1FUHpfcqn', authors: ['Roberto Guzman'], title: 'Title 1', published: false, location: 'Aguas Buenas, PR', publication_date: '2020-01-02',incident_date:'2017-08-03',modification_date:'2020-03-01',infrastructure_type:['Building'], damage_type: ['Flooding', 'Fire'], language:'English', tag:['Flood'] },
//  {id: 'iO0PxjKJY0FwezeVq943', authors: ['Yomar Ruiz'], title: 'Title 2', published: true, location: 'Guanica, PR', publication_date:'2020-02-01',incident_date:'2017-07-03',modification_date:'2020-03-02',infrastructure_type:['Building'], damage_type: ['Broken Sewer'], language:'Spanish', tag:['Earthquake'] },
//  {id: 'qkdQoXSmnNeMISTmMP4f', authors: ['Alberto Canela'], title: 'Title 3', published: false, location: 'Fajardo, PR',publication_date: '2019-10-02', incident_date:'2017-08-13',modification_date:'2020-03-03',infrastructure_type:['Building'], damage_type: ['Flooding'], language:'Mandarin', tag:['Flood'] },
//  {id: 'tPbl1DyxToy1FUHpfcqn', authors: ['Roberto Guzman'], title: 'Title 1', published: false, location: 'Utuado, PR', publication_date: '2020-01-02',incident_date:'2017-08-03',modification_date:'2020-03-01',infrastructure_type:['Building'], damage_type: ['Flooding', 'Fire'], language:'English', tag:['Flood'] },
//  {id: 'iO0PxjKJY0FwezeVq943', authors: ['Yomar Ruiz'], title: 'Title 2', published: true, location: 'Vieques, PR', publication_date:'2020-02-01',incident_date:'2017-07-03',modification_date:'2020-03-02',infrastructure_type:['Building'], damage_type: ['Broken Sewer'], language:'Spanish', tag:['Earthquake'] },
//  {id: 'qkdQoXSmnNeMISTmMP4f', authors: ['Alberto Canela'], title: 'Title 3', published: false, location: 'Yabucoa, PR',publication_date: '2019-10-02', incident_date:'2017-08-13',modification_date:'2020-03-03',infrastructure_type:['Bridge'], damage_type: ['Flooding'], language:'Mandarin', tag:['Flood'] },
//  {id: 'tPbl1DyxToy1FUHpfcqn', authors: ['Roberto Guzman'], title: 'Title 1', published: false, location: 'Bayamón, PR', publication_date: '2020-01-02',incident_date:'2017-08-03',modification_date:'2020-03-01',infrastructure_type:['Building'], damage_type: ['Flooding', 'Fire'], language:'English', tag:['Flood'] },
//  {id: 'iO0PxjKJY0FwezeVq943', authors: ['Yomar Ruiz'], title: 'Title 2', published: true, location: 'Peñuelas, PR', publication_date:'2020-02-01',incident_date:'2017-07-03',modification_date:'2020-03-02',infrastructure_type:['Building'], damage_type: ['Broken Sewer'], language:'Spanish', tag:['Earthquake'] },
//  {id: 'qkdQoXSmnNeMISTmMP4f', authors: ['Alberto Canela'], title: 'Title 3', published: false, location: 'Ceiba, PR',publication_date: '2019-10-02', incident_date:'2017-08-13',modification_date:'2020-03-03',infrastructure_type:['Building'], damage_type: ['Flooding'], language:'Mandarin', tag:['Flood'] },
//  {id: 'tPbl1DyxToy1FUHpfcqn', authors: ['Roberto Guzman'], title: 'Title 1', published: false, location: 'Añasco, PR', publication_date: '2020-01-02',incident_date:'2017-08-03',modification_date:'2020-03-01',infrastructure_type:['Building'], damage_type: ['Flooding', 'Fire'], language:'English', tag:['Flood'] },
//  {id: 'iO0PxjKJY0FwezeVq943', authors: ['Yomar Ruiz'], title: 'Title 2', published: true, location: 'Moca, PR', publication_date:'2020-02-01',incident_date:'2017-07-03',modification_date:'2020-03-02',infrastructure_type:['Building'], damage_type: ['Broken Sewer'], language:'Spanish', tag:['Earthquake'] },
//  {id: 'qkdQoXSmnNeMISTmMP4f', authors: ['Alberto Canela'], title: 'Title 3', published: false, location: 'Arroyo, PR',publication_date: '2019-10-02', incident_date:'2017-08-13',modification_date:'2020-03-03',infrastructure_type:['Building'], damage_type: ['Flooding'], language:'Mandarin', tag:['Flood'] },
//
// ];
// const filters: Filters[] = [
//   { creators: ['Roberto Guzman', 'Alejandro Vasquez', 'Alberto Canela', 'Jainel Torres', 'Yomar Ruiz'],
//     infrastructure_type: ['Building', 'Bridge'],
//     damage_type: ['Flooding', 'Fire', 'Broken Sewer'],
//     tag: ['Flood', 'Hurricane', 'Earthquake']
//   },
// ];

//const mapDocument: MapMetadata[] = [
//  {id: 'qkdQoXSmnNeMISTmMP4f', title: 'Title 1', location: ['Caguas, PR', 'Maricao, PR'], publication_date: '2020-01-02',incident_date:'2017-08-03',infrastructure_type: ['Building'], damage_type: ['Flooding', 'Fire', 'Flooding', 'Fire'],tag:['Flood', 'Hurricane'], language:'English' },
//  {id: 'iO0PxjKJY0FwezeVq943', title: 'Title 2', location: ['Ponce, PR', 'Rio Pierdas, PR'], publication_date: '2020-01-02',incident_date:'2017-08-03',infrastructure_type: ['Building'], damage_type: ['Flooding', 'Fire', 'Flooding', 'Fire'],tag:['Flood', 'Hurricane'], language:'English' },
//  {id: 'tPbl1DyxToy1FUHpfcqn', title: 'Title 3', location: ['Aguas Buenas, PR', 'Las Marias, PR'], publication_date: '2020-01-02',incident_date:'2017-08-03',infrastructure_type: ['Building'], damage_type: ['Flooding', 'Fire', 'Flooding', 'Fire'],tag:['Flood', 'Hurricane'], language:'English' },
//  {id: 'qkdQoXSmnNeMISTmMP4f', title: 'Title 4', location: ['San Juan, PR', 'Vieques, PR'], publication_date: '2020-01-02',incident_date:'2017-08-03',infrastructure_type: ['Building'], damage_type: ['Flooding', 'Fire', 'Flooding', 'Fire'],tag:['Flood', 'Hurricane'], language:'English' },
//  {id: 'iO0PxjKJY0FwezeVq943', title: 'Title 5', location: ['Playa Sucia, Cabo Rojo, PR', 'Playita Azul, Fajardo PR'], publication_date: '2020-01-02',incident_date:'2017-08-03',infrastructure_type: ['Building'], damage_type: ['Flooding', 'Fire', 'Flooding', 'Fire'],tag:['Flood', 'Hurricane'], language:'English' },
//  {id: 'iO0PxjKJY0FwezeVq943', title: 'Title 6', location: ['Utuado, PR', 'Salinas, PR'], publication_date: '2020-01-02',incident_date:'2017-08-03',infrastructure_type: ['Building'], damage_type: ['Flooding', 'Fire', 'Flooding', 'Fire'],tag:['Flood', 'Hurricane'], language:'English' },
//
//];

// const xyDocument: XY[] = [
//     {id: 'tPbl1DyxToy1FUHpfcqn', title: 'The great Flooding', publication_date: '2020-01-02',incident_date:'2017-08-03',infrastructure_type:['Building', 'Energy'], damage_type:['Flooding', 'broken sewer'], tag:['Flood'] },
//     {id: 'iO0PxjKJY0FwezeVq943', title: 'The great Shake',  publication_date:'2020-02-01',incident_date:'2017-07-03',infrastructure_type:['Transportation', 'Building'], damage_type:['broken sewer'],tag:['Earthquake', 'Tsunami'] },
//     {id: 'qkdQoXSmnNeMISTmMP4f', title: 'The great Rain', publication_date: '2019-10-02', incident_date:'2010-08-13',infrastructure_type:['Building', 'Water'], damage_type:['Flooding', 'Fire'], tag:['Flood'] },
//     {id: 'RYTSBZAiwlAG0t8EOb6B', title: 'The great Wind', publication_date: '2020-02-03', incident_date:'2018-07-03',infrastructure_type:['Energy'], damage_type:['Flooding'], tag:['Hurricane']  },
//     {id: 'VzunBYihBS05mpj0U9pP', title: 'The great Story', publication_date:'2018-02-02',incident_date:'2016-08-20',infrastructure_type:['Building'], damage_type:['Fallen Structure'], tag:['Tornado']  },
//     {id: 'VzunBKHhBSl5npj0U9pP', title: 'The great Mind', publication_date:'2016-09-02',incident_date:'2014-08-10',infrastructure_type:['Water', 'Energy'], damage_type:['Burn'], tag:['Tsunami', 'Fire']  },
//     {id: 'VzunaoihBS05hpsgU9pP', title: 'The great Place', publication_date:'2017-02-02',incident_date:'2015-07-19',infrastructure_type:['Water'], damage_type:['Burn'], tag:['Fire']  },
//     {id: 'VzunBYihBS05kpsJW9pP', title: 'The great Fall', publication_date:'2019-02-02',incident_date:'2012-01-03',infrastructure_type:['Building', 'Water'], damage_type:['Burn', 'Flooding'], tag:['Fire', 'Tornado']  },
//     {id: 'Vzun980hBS05lpj0U9pP', title: 'The great Structure', publication_date:'2015-02-02',incident_date:'2011-04-12',infrastructure_type:['Structure'], damage_type:['Burn'], tag:['Fire']  },
//     {id: 'HHkwBYihBS05qpj0U9pP', title: 'The great Port', publication_date:'2017-02-02',incident_date:'2015-05-11',infrastructure_type:['Energy'], damage_type:['Fallen Structure', 'Crack'], tag:['Fire', 'Earthquake']  },
// ];

// const timelineDocument: Timeline[] = [
//     {id: 'tPbl1DyxToy1FUHpfcqn', title: 'The great Flooding', timeline: [ {event:'it flooded', startDate:'2017-07-09', endDate: '2017-09-10'}, {event:'started Case Study', startDate:'2018-01-09', endDate: '2018-02-10'}] },
//     {id: 'iO0PxjKJY0FwezeVq943', title: 'The great Shake', timeline: [{event:'the ground shake', startDate:'2016-01-09', endDate: '2016-09-10'}, {event:'started Case Study', startDate:'2017-03-09', endDate: '2017-04-10'}, {event:'ended Case Study', startDate:'2020-01-09', endDate: '2020-02-10'}, {event:'aftermath crisis', startDate:'2016-10-01', endDate: '2017-02-12'}]  },
//     {id: 'qkdQoXSmnNeMISTmMP4f', title: 'The great Rain', timeline: [{event:'it rained', startDate:'2017-09-09', endDate: '2017-09-10'}, {event:'started Case Study', startDate:'2019-07-09', endDate: '2019-07-10'}]  },
//     {id: 'RYTSBZAiwlAG0t8EOb6B', title: 'The great Wind', timeline: [{event:'it rained with wind', startDate:'2017-07-10', endDate: '2017-09-10'}]   },
//     {id: 'VzunBYihBS05mpj0U9pP', title: 'The great Fire', timeline: [{event:'it burned a lot', startDate:'2018-07-09', endDate: '2019-09-10'}, {event:'started Case Study', startDate:'2019-11-09', endDate: '2019-12-10'}, {event:'ended Case Study', startDate:'2020-01-09', endDate: '2020-02-10'}]},
// ];



@Injectable()
export class FakebackendService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body, params } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
    //    case url.endsWith('/api/collabrequest/create') && method === 'POST':
    //      return collabRequest();
      //  case url.endsWith('/api/documents') && method === 'GET':
      //    return getDocuments();
      //  case url.endsWith('/api/filters') && method === 'GET':
      //    return getFilters();
  //     case url.endsWith('/api/documents/view') && method === 'POST':
  //       return getDocument();
   //     case url.endsWith('/api/map/filters') && method === 'GET':
   //       return mapFilters();
//        case url.endsWith('/visualize/comparison-graph') && method === 'GET':
//          return docXY();
//        case url.endsWith('/visualize/timeline') && method === 'GET':
//          return docTimeline();
        default:
          return next.handle(request);
      }
    }

    // Collaborators
//   function collabRequest() {
//     if (checkEmail(body.email)) {
//       collaborators.push(
//         {id: 'aq9zI01ORNE9Okyziyup', first_name: body.firstName, last_name: body.lastName, email: body.email}
//       );
//       console.log(collaborators);
//       return ok();
//   } else {
//       return collaboratorExist();
//     }
//   }
    // documents
//    function getDocuments() {
//      return ok(dbDocuments);
//    }
    // function getFilters() {
    // return ok(filters);
   // }
 //  function getDocument() {
 //    const { id } = body;
 //    for (let x = 0 ; x < dbDocuments.length; x ++){
 //      if(dbDocuments[x].id === id){
 //        return ok(sample_document);
 //      }
 //    }

 //     return throwError({ status: 500, error: { message: 'Document not found.' } })
  //  }

//   function mapFilters() {
//     return ok({
//       infrastructure_type: ['Building', 'Bridge', 'Port'],
//       damage_type: ['Flooding', 'Fire', 'Broken Sewer', 'Tornado'],
//       tag: ['Flood', 'Hurricane', 'Earthquake', 'Volcano']
//     });
//   }
//
   //function docXY() {
   //  console.log(xyDocument);
   //  return ok(xyDocument);
   //}

//    function docTimeline() {
//      console.log(timelineDocument);
//      return ok(timelineDocument);
//    }

    // helper functions

 //   function ok(body?) {
 //     return of(new HttpResponse({ status: 200, body }));
 //   }
 //
 //   function collaboratorExist() {
 //     return throwError({ status: 401, error: { message: 'Collaborator Request already creasted' } });
 //   }

//    function checkEmail(email: string) {
//      let valid = true;
//      collaborators.forEach(e => {
//        if (e.email === email) {
//          console.log('found');
//          valid = false;
//        }
//      });
//      return valid;
//    }
//  }
//}

//export const fakeBackendProvider = {
//  // use fake backend in place of Http service for backend-less development
//  provide: HTTP_INTERCEPTORS,
//  useClass: FakebackendService,
//  multi: true
//} ;
