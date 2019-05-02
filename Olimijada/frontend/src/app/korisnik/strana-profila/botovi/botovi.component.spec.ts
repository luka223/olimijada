import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotoviComponent } from './botovi.component';

describe('BotoviComponent', () => {
  let component: BotoviComponent;
  let fixture: ComponentFixture<BotoviComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotoviComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotoviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
