import { TestBed, inject } from '@angular/core/testing';

import { KorisnikService } from './korisnik.service';

describe('KorisnikService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KorisnikService]
    });
  });

  it('should be created', inject([KorisnikService], (service: KorisnikService) => {
    expect(service).toBeTruthy();
  }));
});
