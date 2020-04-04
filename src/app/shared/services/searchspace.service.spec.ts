import { TestBed } from '@angular/core/testing';

import { SearchspaceService } from './searchspace.service';

describe('DocumentsService', () => {
  let service: SearchspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
