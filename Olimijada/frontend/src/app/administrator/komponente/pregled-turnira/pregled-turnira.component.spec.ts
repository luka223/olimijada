import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledTurniraComponent } from './pregled-turnira.component';

describe('PregledTurniraComponent', () => {
  let component: PregledTurniraComponent;
  let fixture: ComponentFixture<PregledTurniraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregledTurniraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledTurniraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
