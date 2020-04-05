import { TestBed } from '@angular/core/testing';

import { FakebackendService} from './fakebackend.service';

describe('FakebackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FakebackendService
      ]
  }));

  it('should be created', () => {
    const interceptor: FakebackendService = TestBed.inject(FakebackendService);
    expect(interceptor).toBeTruthy();
  });
});
