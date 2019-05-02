import { TestBed, inject } from '@angular/core/testing';

import { TurnirService } from './turnir.service';

describe('TurnirService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TurnirService]
    });
  });

  it('should be created', inject([TurnirService], (service: TurnirService) => {
    expect(service).toBeTruthy();
  }));
});
