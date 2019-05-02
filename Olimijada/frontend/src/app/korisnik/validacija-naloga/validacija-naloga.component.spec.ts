import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacijaNalogaComponent } from './validacija-naloga.component';

describe('ValidacijaNalogaComponent', () => {
  let component: ValidacijaNalogaComponent;
  let fixture: ComponentFixture<ValidacijaNalogaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidacijaNalogaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacijaNalogaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
