import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracijaKorisnikaComponent } from './administracija-korisnika.component';

describe('AdministracijaKorisnikaComponent', () => {
  let component: AdministracijaKorisnikaComponent;
  let fixture: ComponentFixture<AdministracijaKorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracijaKorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracijaKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
