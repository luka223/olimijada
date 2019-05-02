import { TestBed, inject } from '@angular/core/testing';

import { IgraService } from './igra.service';

describe('IgraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IgraService]
    });
  });

  it('should be created', inject([IgraService], (service: IgraService) => {
    expect(service).toBeTruthy();
  }));
});
