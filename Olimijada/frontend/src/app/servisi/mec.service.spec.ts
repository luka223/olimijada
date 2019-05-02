import { TestBed, inject } from '@angular/core/testing';

import { MecService } from './mec.service';

describe('MecService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MecService]
    });
  });

  it('should be created', inject([MecService], (service: MecService) => {
    expect(service).toBeTruthy();
  }));
});
