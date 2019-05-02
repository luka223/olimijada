import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaljiProfilaComponent } from './detalji-profila.component';

describe('DetaljiProfilaComponent', () => {
  let component: DetaljiProfilaComponent;
  let fixture: ComponentFixture<DetaljiProfilaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetaljiProfilaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaljiProfilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
