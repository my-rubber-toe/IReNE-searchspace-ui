import {TestBed} from '@angular/core/testing';

import {SearchSpaceService} from './searchspace.service';

describe('DocumentsService', () => {
  let service: SearchSpaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchSpaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});

