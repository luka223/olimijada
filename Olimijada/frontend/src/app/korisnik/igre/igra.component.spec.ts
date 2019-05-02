import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgraComponent } from './igra.component';

describe('IgraComponent', () => {
  let component: IgraComponent;
  let fixture: ComponentFixture<IgraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
