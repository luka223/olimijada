import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurniriComponent } from './turniri.component';

describe('TurniriComponent', () => {
  let component: TurniriComponent;
  let fixture: ComponentFixture<TurniriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurniriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurniriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
