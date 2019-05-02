import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StranaMecaComponent } from './strana-meca.component';

describe('StranaMecaComponent', () => {
  let component: StranaMecaComponent;
  let fixture: ComponentFixture<StranaMecaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StranaMecaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StranaMecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
