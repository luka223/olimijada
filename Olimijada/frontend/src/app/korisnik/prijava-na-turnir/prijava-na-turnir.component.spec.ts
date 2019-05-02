import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrijavaNaTurnirComponent } from './prijava-na-turnir.component';

describe('PrijavaNaTurnirComponent', () => {
  let component: PrijavaNaTurnirComponent;
  let fixture: ComponentFixture<PrijavaNaTurnirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrijavaNaTurnirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrijavaNaTurnirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
