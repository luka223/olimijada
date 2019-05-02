import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledIgaraComponent } from './pregled-igara.component';

describe('PregledIgaraComponent', () => {
  let component: PregledIgaraComponent;
  let fixture: ComponentFixture<PregledIgaraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregledIgaraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledIgaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
