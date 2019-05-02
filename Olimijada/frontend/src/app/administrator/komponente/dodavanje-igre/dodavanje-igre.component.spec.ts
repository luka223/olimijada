import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodavanjeIgreComponent } from './dodavanje-igre.component';

describe('DodavanjeIgreComponent', () => {
  let component: DodavanjeIgreComponent;
  let fixture: ComponentFixture<DodavanjeIgreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodavanjeIgreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodavanjeIgreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
