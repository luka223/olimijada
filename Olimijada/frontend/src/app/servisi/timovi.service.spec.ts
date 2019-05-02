import { TestBed, inject } from '@angular/core/testing';

import { TimoviService } from './timovi.service';

describe('TimoviService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimoviService]
    });
  });

  it('should be created', inject([TimoviService], (service: TimoviService) => {
    expect(service).toBeTruthy();
  }));
});
