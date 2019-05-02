import { TestBed, inject } from '@angular/core/testing';

import { BotoviService } from './botovi.service';

describe('BotoviService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BotoviService]
    });
  });

  it('should be created', inject([BotoviService], (service: BotoviService) => {
    expect(service).toBeTruthy();
  }));
});
