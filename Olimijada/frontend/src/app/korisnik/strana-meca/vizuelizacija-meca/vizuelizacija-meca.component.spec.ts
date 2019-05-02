import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VizuelizacijaMecaComponent } from './vizuelizacija-meca.component';

describe('VizuelizacijaMecaComponent', () => {
  let component: VizuelizacijaMecaComponent;
  let fixture: ComponentFixture<VizuelizacijaMecaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VizuelizacijaMecaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VizuelizacijaMecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
