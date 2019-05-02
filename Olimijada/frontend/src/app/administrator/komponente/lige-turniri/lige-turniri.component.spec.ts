import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LigeTurniriComponent } from './lige-turniri.component';

describe('LigeTurniriComponent', () => {
  let component: LigeTurniriComponent;
  let fixture: ComponentFixture<LigeTurniriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LigeTurniriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LigeTurniriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
